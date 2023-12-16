import {ContinueWithLastTimeEntryUseCase} from "../application/cases";
import {configFilename} from "../core";
import {TogglApi, http} from "../infrastructure/data-sources";
import {TimeEntryRepositoryImplementation} from "../infrastructure/repositories";
import {TrackCommand} from "../infrastructure/track-command";

export default class Continue extends TrackCommand {
    static description = 'Continue with last time entry.'
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
        const useCase = new ContinueWithLastTimeEntryUseCase(timeEntryRepository)

        try {
            const newEntry = await useCase.exec()
            if (newEntry) {
                this.log(`Continuing with time entry "${newEntry.description}" for "${newEntry.project.name}" project.`)
            } else {
                this.log("There is no time entry to continue with.")
            }
        } catch (error) {
            this.error(`Unexpected error: ${error}`)
        }
    }
}
