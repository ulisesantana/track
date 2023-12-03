/* eslint-disable @typescript-eslint/no-unused-vars */

import {TimeEntryRepository} from "../../src/application/repositories";
import {Nullable, TimeEntry, TimeEntryList} from "../../src/core";
import {buildTimeEntry} from "../builders";

export class TimeEntryRepositoryDouble implements TimeEntryRepository {
  private currentEntry: Nullable<TimeEntry> = null
  private stopEntryDummy: Nullable<TimeEntry> = null
  constructor(readonly workspaceId: number = 123) {
  }

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

  async stopEntry(id: number, stopTime: string): Promise<Nullable<TimeEntry>> {
    return this.stopEntryDummy
  }

  async updateEntry(entry: Partial<TimeEntry>) {
    return buildTimeEntry()
  }

}
