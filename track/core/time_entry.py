import time
from dataclasses import dataclass

from track.core.helpers import TimeHelper


@dataclass
class TimeEntry:
    id: int
    pid: int
    wid: int
    description: str
    _duration: int

    @property
    def duration(self) -> int:
        if self._duration < 0:
            return int(time.time()) + self._duration
        return self._duration

    @duration.setter
    def duration(self, value: int) -> None:
        self._duration = value

    def __str__(self):
        return f"{TimeHelper.seconds_to_hms_string(self.duration)} - {self.description}"
