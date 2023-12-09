import {Args, Command, Flags} from '@oclif/core'
import path from "node:path";

import {GetConfigurationUseCase, StartTimeEntryUseCase} from "../application/cases";
import {ConfigurationValidator, configFilename} from "../core";
import {FileSystemDataSource, TogglApi, http} from "../infrastructure/data-sources";
import {
    ConfigurationRepositoryImplementation,
    ProjectRepositoryImplementation,
    TimeEntryRepositoryImplementation
} from "../infrastructure/repositories";

export default class Start extends Command {
    static args = {
        description: Args.string({description: 'Time entry description.'}),
    }

    static description = 'Start a new time entry.'
    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static flags = {
        project: Flags.string({char: 'p', description: 'Project ID or Project name'}),
    }

    public async run(): Promise<void> {
        const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
        const config = await new GetConfigurationUseCase(configurationRepository).exec()
        const configValidation = ConfigurationValidator.isRequiredConfigAvailable(config)
        if (configValidation.error) {
            this.error(configValidation.message)
        }

        const {args, flags} = await this.parse(Start)
        if (!config.defaultTimeEntry && !args.description) {
            this.error('Missing time entry description argument. ' +
                'You can add a default time entry description with ' +
                '\'track config set --description "You default description of choice"\'.')
        }

        if (!config.projectId && !flags.project) {
            this.error('Missing project flag for the time entry. ' +
                'You can add a default project ID with' +
                ' \'track config set project\'.')
        }

        const togglAPI = new TogglApi({
            http, token: config.apiToken, workspaceId: config.workspaceId
        })
        const projectRepository = new ProjectRepositoryImplementation(togglAPI)
        const timeEntryRepository = new TimeEntryRepositoryImplementation(togglAPI)
        const useCase = new StartTimeEntryUseCase(timeEntryRepository, projectRepository)
        const description = args.description || config.defaultTimeEntry
        const project = flags.project || config.projectId

        try {
            const newEntry = await useCase.exec({description, project})
            this.log(`Started time entry "${newEntry.description}" for "${newEntry.project.name}" project.`)
        } catch (error) {
            this.error(`Unexpected error: ${error}`)
        }
    }
}
