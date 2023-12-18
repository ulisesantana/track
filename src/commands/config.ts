import {Command} from '@oclif/core'
import path from "node:path";

import {GetConfigurationUseCase} from "../application/cases";
import {configFilename} from "../core";
import {FileSystemDataSource} from "../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../infrastructure/repositories";

export default class Config extends Command {
  static description = 'Get your config for track CLI.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
    const useCase = new GetConfigurationUseCase(configurationRepository)
    try {
      const config = await useCase.exec()
      this.log('Your config for track CLI:')
      for (const [key, value] of Object.entries(config)) {
        this.log(` - ${key}: ${value}`)
      }
    } catch (error) {
      this.log(`There was an error trying to get your config. Detailed error:`)
      this.log(`${error}`)
    }
  }
}
