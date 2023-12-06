import {Command} from '@oclif/core'
import createConfigurationStore from 'configuration-store';

import {GetConfigurationUseCase} from "../application/cases";
import {ConfigurationRepository} from "../application/repositories";
import {Configuration} from "../core";
import {ConfigurationRepositoryImplementation} from "../infrastructure/repositories";

export default class Config extends Command {
  static configurationRepository: ConfigurationRepository = new ConfigurationRepositoryImplementation(createConfigurationStore<Configuration>({filename: 'track'}))

  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    const useCase = new GetConfigurationUseCase(Config.configurationRepository)
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
