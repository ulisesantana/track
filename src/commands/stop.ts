import {Command} from '@oclif/core'
import path from "node:path";

import {GetConfigurationUseCase, StopCurrentTimeEntryUseCase} from "../application/cases";
import {ConfigurationValidator, configFilename} from "../core";
import {FileSystemDataSource, TogglApi, http} from "../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation, TimeEntryRepositoryImplementation} from "../infrastructure/repositories";

export default class Stop extends Command {
  static description = 'Stop running time entry.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
    const config = await new GetConfigurationUseCase(configurationRepository).exec()
    const configValidation = ConfigurationValidator.isRequiredConfigAvailable(config)
    if (configValidation.error) {
      this.error(configValidation.message)
    }

    const togglAPI = new TogglApi({
      http,
      token: config.apiToken,
      workspaceId: config.workspaceId
    })
    const timeEntryRepository = new TimeEntryRepositoryImplementation(togglAPI)
    const useCase = new StopCurrentTimeEntryUseCase(timeEntryRepository)

    try {
      const updatedEntry = await useCase.exec()
      if (updatedEntry) {
        this.log(`Time entry "${updatedEntry.description}" stopped for "${updatedEntry.project.name}" project.`)
      } else {
        this.log("There is no time entry running.")
      }
    } catch (error) {
      this.error(`Unexpected error: ${error}`)
    }
  }
}
