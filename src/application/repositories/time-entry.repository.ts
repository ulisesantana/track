import {Nullable, TimeEntry, TimeEntryList} from '../../core';

export interface TimeEntryRepository {
  createEntry(entry: TimeEntry, start: string): Promise<TimeEntry>;

  getCurrentEntry(): Promise<Nullable<TimeEntry>>;

  getCurrentWeekEntries(): Promise<TimeEntryList>;

  getLastEntry(): Promise<Nullable<TimeEntry>>;

  getTodayEntries(): Promise<TimeEntryList>;

  updateEntry(entry: Partial<TimeEntry>): Promise<TimeEntry>;

  workspaceId: number;
}
