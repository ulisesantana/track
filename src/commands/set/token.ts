import {Command} from '@oclif/core'
import path from "node:path";

import {configFilename} from "../../core";
import {FileSystemDataSource} from "../../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../../infrastructure/repositories";
import Setup from "../setup";

export default class SetToken extends Command {
    static description = 'Setup your Toggl Track API token for track.'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    public async run(): Promise<void> {
        const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
        try {
            const token = await Setup.setApiKey(configurationRepository)
            this.log(`Your Toggl Track token has been updated to "${token}".`)
        } catch (error) {
            this.log(`There was an error trying to setting up your config. Detailed error:`)
            this.log(`${error}`)
        }
    }


}
