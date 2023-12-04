import {Nullable, TimeEntry, TimeEntryList} from '../../core';

export interface TimeEntryRepository {
  createEntry(entry: TimeEntry, start: Date): Promise<TimeEntry>;

  getCurrentEntry(): Promise<Nullable<TimeEntry>>;

  getCurrentWeekEntries(): Promise<TimeEntryList>;

  getLastEntry(): Promise<Nullable<TimeEntry>>;

  getTodayEntries(): Promise<TimeEntryList>;

  stopEntry(id: number, stopTime: Date): Promise<Nullable<TimeEntry>>;
}
