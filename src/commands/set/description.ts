import {Command} from '@oclif/core'
import path from "node:path";

import {configFilename} from "../../core";
import {FileSystemDataSource} from "../../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../../infrastructure/repositories";
import Setup from "../setup";

export default class SetDescription extends Command {
    static description = 'Set your default time entry description for track.'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]


    public async run(): Promise<void> {
        const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
        try {
            const defaultTimeEntry = await Setup.setDefaultTimeEntryDescription(configurationRepository)
            this.log(`Your default time entry description has been set to: "${defaultTimeEntry}"`);
        } catch (error) {
            this.log(`There was an error trying to setting up your config. Detailed error:`)
            this.log(`${error}`)
        }
    }


}
