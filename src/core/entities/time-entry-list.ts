import { Duration } from "./duration";
import {TimeEntry} from "./time-entry";

export class TimeEntryList {
  values: Array<TimeEntry>;

  constructor(values: Array<TimeEntry>) {
    this.values = values;
  }

  getTotalDuration(): Duration {
    const totalDuration = new Duration(0)

    for (const {duration} of this.values) {
      totalDuration.add(duration)
    }

    return totalDuration
  }

  groupEntriesByDescription(): TimeEntryList {
    const groupedEntries: Record<string, TimeEntry> = {};

    for (const entry of this.values) {
      const dictId = entry.project.id + entry.description
      if (groupedEntries[dictId]) {
        groupedEntries[dictId].duration.add(entry.duration);
      } else {
        groupedEntries[dictId] = new TimeEntry(entry)
      }
    }

    return new TimeEntryList(Object.values(groupedEntries));
  }
}
