import {Args, Flags} from '@oclif/core'

import {StartTimeEntryUseCase} from "../application/cases";
import {TimeEntry, configFilename} from "../core";
import {TogglApi, http} from "../infrastructure/data-sources";
import {ProjectRepositoryImplementation, TimeEntryRepositoryImplementation} from "../infrastructure/repositories";
import {TrackCommand} from "../infrastructure/track-command";
import {inputTimeEntryDescription, selectProject} from "../infrastructure/ui";

export default class Start extends TrackCommand {
    static args = {
        description: Args.string({description: 'Time entry description.'}),
    }

    static description = 'Start a new time entry.'
    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static flags = {
        interactive: Flags.boolean({char: 'i', description: 'Create time entry interactively'}),
        project: Flags.string({char: 'p', description: 'Project ID or Project name'}),
    }

    printStartedEntry(entry: TimeEntry) {
        this.log(`Started time entry "${entry.description}" for "${entry.project.name}" project.`)
    }

    public async run(): Promise<void> {
        const config = await this.getConfig(configFilename)
        const togglAPI = new TogglApi({
            http, token: config.apiToken, workspaceId: config.workspaceId
        })
        const projectRepository = new ProjectRepositoryImplementation(togglAPI)
        const timeEntryRepository = new TimeEntryRepositoryImplementation(togglAPI)
        const useCase = new StartTimeEntryUseCase(timeEntryRepository, projectRepository)

        const {args, flags} = await this.parse(Start)
        if (flags.interactive) {
            const description = await inputTimeEntryDescription('What are you going to do?')
            const userInfo = await TogglApi.getUserInfo(config.apiToken, http)
            const project = await selectProject(userInfo, 'For which project?')

            const newEntry = await useCase.exec({description, project: project.id})
            this.printStartedEntry(newEntry)
            return
        }

        if (!config.defaultTimeEntry && !args.description) {
            this.error('Missing time entry description argument. ' +
                'You can add a default time entry description with ' +
                '\'track set description\'.')
        }

        if (!config.projectId && !flags.project) {
            this.error('Missing project flag for the time entry. ' +
                'You can add a default project ID with' +
                ' \'track set project\'.')
        }


        const description = args.description || config.defaultTimeEntry
        const project = flags.project || config.projectId

        try {
            const newEntry = await useCase.exec({description, project})
            this.printStartedEntry(newEntry)
        } catch (error) {
            this.error(`Unexpected error: ${error}`)
        }
    }
}
