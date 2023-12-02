import {TimeEntryRepository} from "../../src/application/repositories";
import {Nullable, TimeEntry, TimeEntryList} from "../../src/core";

export class TimeEntryRepositoryDouble implements TimeEntryRepository {
  private currentEntry: Nullable<TimeEntry> = null
  constructor(readonly workspaceId: number = 123) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createEntry(entry: TimeEntry, start: string) {
    return entry
  }

  async getCurrentEntry() {
    return this.currentEntry;
  }

  async getCurrentWeekEntries() {
    return new TimeEntryList([]);
  }

  async getLastEntry() {
    return null;
  }

  async getTodayEntries() {
    return new TimeEntryList([]);
  }

  setCurrentEntry(entry: Nullable<TimeEntry>): TimeEntryRepositoryDouble {
    this.currentEntry = entry
    return this
  }

  async updateEntry(entry: Partial<TimeEntry>) {
    return new TimeEntry({description: "Dumb", id: 0, pid: 0, wid: 0, ...entry})
  }

}
