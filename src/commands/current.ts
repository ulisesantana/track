import {GetCurrentTimeEntryUseCase} from "../application/cases";
import {configFilename} from "../core";
import {TogglApi, http} from "../infrastructure/data-sources";
import {TimeEntryRepositoryImplementation} from "../infrastructure/repositories";
import {TrackCommand} from "../infrastructure/track-command";

export default class Current extends TrackCommand {
  static description = 'Show running time entry.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    const config = await this.getConfig(configFilename)
    const togglAPI = new TogglApi({
      http,
      token: config.apiToken,
      workspaceId: config.workspaceId
    })
    const timeEntryRepository = new TimeEntryRepositoryImplementation(togglAPI)
    const useCase = new GetCurrentTimeEntryUseCase(timeEntryRepository)

    try {
      const entry = await useCase.exec()
      if (entry) {
        this.log(entry.toString())
      } else {
        this.log('There is no time entry running.')
      }
    } catch (error) {
      this.error(`Unexpected error: ${error}`)
    }
  }
}
