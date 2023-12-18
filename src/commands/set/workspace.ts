import {Command} from '@oclif/core'
import path from "node:path";

import {configFilename} from "../../core";
import {FileSystemDataSource, TogglApi, http} from "../../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../../infrastructure/repositories";
import Setup from "../setup";

export default class SetWorkspace extends Command {
    static description = 'Setup your default workspace for track CLI.'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    private static sortByName = (a: { name: string }, b: { name: string }) =>
        a.name > b.name
            ? 1
            : a.name < b.name
                ? -1
                : 0

    public async run(): Promise<void> {
        const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
        try {
            const config = await configurationRepository.getAll()
            const userInfo = await TogglApi.getUserInfo(config.apiToken, http)
            const result = await Setup.setDefaultWorkspace(userInfo, configurationRepository)
            this.log(`Your default workspace has been set to: ${result}`);
        } catch (error) {
            this.log(`There was an error trying to setting up your config. Detailed error:`)
            this.log(`${error}`)
        }
    }
}
