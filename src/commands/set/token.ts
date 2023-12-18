import {Command} from '@oclif/core'
import path from "node:path";

import {configFilename} from "../../core";
import {FileSystemDataSource} from "../../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../../infrastructure/repositories";
import Setup from "../setup";

export default class SetToken extends Command {
    static description = 'Setup your Toggl Track API token for track CLI.'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    public async run(): Promise<void> {
        const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
        try {
            await Setup.setApiKey(configurationRepository)
            this.log('Your token has been updated.')
        } catch (error) {
            this.log(`There was an error trying to setting up your config. Detailed error:`)
            this.log(`${error}`)
        }
    }


}
