import {StopCurrentTimeEntryUseCase} from "../application/cases";
import {configFilename} from "../core";
import {TogglApi, http} from "../infrastructure/data-sources";
import {TimeEntryRepositoryImplementation} from "../infrastructure/repositories";
import {TrackCommand} from "../infrastructure/track-command";

export default class Stop extends TrackCommand {
  static description = 'Stop running time entry.'

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
