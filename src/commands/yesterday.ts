import {GetYesterdayReportUseCase} from "../application/cases";
import {configFilename} from "../core";
import {TogglApi, http} from "../infrastructure/data-sources";
import {TimeEntryRepositoryImplementation} from "../infrastructure/repositories";
import {TrackCommand} from "../infrastructure/track-command";

export default class Yesterday extends TrackCommand {
  static description = 'Show time entries run yesterday.'

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
    const useCase = new GetYesterdayReportUseCase(timeEntryRepository)

    try {
      const report = await useCase.exec()
      if (report.totalDuration.value > 0) {
        this.log(report.toString())
      } else {
        this.log('There are no entries for yesterday.')
      }
    } catch (error) {
      this.error(`Unexpected error: ${error}`)
    }
  }
}
