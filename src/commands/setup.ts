import {Command} from '@oclif/core'
import path from "node:path";

import {configFilename} from "../core";
import {FileSystemDataSource, TogglApi, UserInfo, http} from "../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../infrastructure/repositories";
import {inputTimeEntryDescription, inputToken, selectProject, selectWorkspace} from "../infrastructure/ui";

export default class Setup extends Command {
    static description = 'Setup your config for track.'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static async setApiKey(configurationRepository: ConfigurationRepositoryImplementation) {
        const apiKey = await inputToken();
        await configurationRepository.setApiToken(apiKey)
        return apiKey;
    }

    static async setDefaultProject(userInfo: UserInfo, configurationRepository: ConfigurationRepositoryImplementation) {
        const {id, name} = await selectProject(userInfo)
        await configurationRepository.setDefaultProjectId(id)
        return name
    }

    static async setDefaultTimeEntryDescription(configurationRepository: ConfigurationRepositoryImplementation) {
        const defaultTimeEntry = await inputTimeEntryDescription()
        await configurationRepository.setDefaultTimeEntry(defaultTimeEntry)
        return defaultTimeEntry
    }

    static async setDefaultWorkspace(userInfo: UserInfo, configurationRepository: ConfigurationRepositoryImplementation) {
        const {id, name} = await selectWorkspace(userInfo)
        await configurationRepository.setDefaultWorkspaceId(id)
        return name
    }

    public async run(): Promise<void> {
        const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
        try {
            // Add your API Key
            const apiKey = await Setup.setApiKey(configurationRepository);
            // Get user info
            const userInfo = await TogglApi.getUserInfo(apiKey, http)
            // Select your default workspace
            await Setup.setDefaultWorkspace(userInfo, configurationRepository);
            // Select your default project
            await Setup.setDefaultProject(userInfo, configurationRepository);
            // Add your default time entry description
            await Setup.setDefaultTimeEntryDescription(configurationRepository);
            this.log('Your config for track has been setup.')
        } catch (error) {
            this.log(`There was an error trying to setting up your config. Detailed error:`)
            this.log(`${error}`)
        }
    }
}
