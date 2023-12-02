import { Duration } from "./duration";
import {TimeEntry} from "./time-entry";

export class TimeEntryList {
  values: TimeEntry[];

  constructor(values: TimeEntry[]) {
    this.values = values;
  }

  getTotalDuration(): Duration {
    const totalDuration = new Duration(0)

    for (const {duration} of this.values) {
      totalDuration.add(duration)
    }

    return totalDuration
  }

  groupEntriesByDescription(): Record<string, TimeEntry> {
    const groupedEntries: Record<string, TimeEntry> = {};

    for (const entry of this.values) {
      if (groupedEntries[entry.description]) {
        groupedEntries[entry.description].duration.add(entry.duration);
      } else {
        groupedEntries[entry.description] = new TimeEntry(entry)
      }
    }

    return groupedEntries;
  }
}
