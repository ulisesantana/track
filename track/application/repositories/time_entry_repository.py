from abc import ABC, abstractmethod

from track.core import TimeEntry, TimeEntryList


class TimeEntryRepository(ABC):
    workspace_id: int

    @abstractmethod
    def get_last_entry(self) -> TimeEntry:
        pass

    @abstractmethod
    def get_current_entry(self) -> TimeEntry:
        pass

    @abstractmethod
    def create_entry(self, id: int, wid: int, description: str, pid: int, start: str) -> TimeEntry:
        pass

    @abstractmethod
    def update_entry(self, **entry) -> TimeEntry:
        pass

    @abstractmethod
    def get_current_week_entries(self) -> TimeEntryList:
        pass

    @abstractmethod
    def get_today_entries(self) -> TimeEntryList:
        pass
