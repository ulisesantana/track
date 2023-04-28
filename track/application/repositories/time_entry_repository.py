from abc import ABC, abstractmethod
from typing import Dict

from track.core import Project, TimeEntry, TimeEntryList


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

    @abstractmethod
    def get_projects(self) -> Dict[int, Project]:
        pass

    @abstractmethod
    def get_project_by_id(self, id: int) -> Project:
        pass

    @abstractmethod
    def get_project_by_name(self, name: str) -> Project:
        pass
