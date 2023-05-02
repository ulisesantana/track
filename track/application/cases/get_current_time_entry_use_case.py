from dataclasses import dataclass

from track.application.repositories import TimeEntryRepository
from track.application.repositories.project_repository import ProjectRepository


@dataclass
class GetCurrentTimeEntryUseCase:
    time_entry_repository: TimeEntryRepository
    project_repository: ProjectRepository

    def exec(self):
        current_entry = self.time_entry_repository.get_current_entry()
        if current_entry:
            project = self.project_repository.get_project_by_id(current_entry.pid)
            return current_entry, project
