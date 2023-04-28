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
