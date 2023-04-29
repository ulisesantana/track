from dataclasses import dataclass
from typing import List

from track.core import TimeEntry


@dataclass
class TimeEntryList:
    values: List[TimeEntry]

    def get_total_duration(self):
        total_duration = 0
        for entry in self.values:
            total_duration += entry.duration
        return total_duration

    def group_entries_by_description(self):
        grouped_entries = {}
        for entry in self.values:
            if entry.description in grouped_entries:
                grouped_entries[entry.description].duration += entry.duration
            else:
                grouped_entries[entry.description] = entry
        return grouped_entries.values()
