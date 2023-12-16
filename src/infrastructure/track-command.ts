import {Command} from '@oclif/core'
import path from "node:path";

import {GetConfigurationUseCase} from "../application/cases";
import {ConfigurationValidator} from "../core";
import {FileSystemDataSource} from "./data-sources";
import {ConfigurationRepositoryImplementation} from "./repositories";

export abstract class TrackCommand extends Command {
    async getConfig(configFilename: string) {
        const fileSystemDataSource = new FileSystemDataSource(path.join(this.config.configDir, configFilename));
        const configurationRepository = new ConfigurationRepositoryImplementation(fileSystemDataSource)
        const config = await new GetConfigurationUseCase(configurationRepository).exec()
        const configValidation = ConfigurationValidator.isRequiredConfigAvailable(config)
        if (configValidation.error) {
            this.error(configValidation.message)
        }

        return config
    }
}

