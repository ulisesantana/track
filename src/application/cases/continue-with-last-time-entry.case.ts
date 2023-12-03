import {TimeEntry, TimeHelper} from "../../core";
import {TimeEntryRepository} from "../repositories";


export class ContinueWithLastTimeEntryUseCase {

  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly timeHelper: TimeHelper = new TimeHelper()
  ) {}

  async exec(): ReturnType<TimeEntryRepository['getLastEntry']> {
    const lastEntry = await this.timeEntryRepository.getLastEntry();
    if (lastEntry) {
      return this.timeEntryRepository.createEntry(new TimeEntry({
        description: lastEntry.description,
        id: lastEntry.id,
        project: lastEntry.project,
        wid: lastEntry.wid,
      }), this.timeHelper.getCurrentUtcDate());
    }

    return lastEntry
  }
}
