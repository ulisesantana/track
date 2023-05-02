from dataclasses import dataclass

from track.application.repositories import TimeEntryRepository
from track.application.repositories.project_repository import ProjectRepository


@dataclass
class GetCurrentWeekReportUseCase:
    time_entry_repository: TimeEntryRepository
    project_repository: ProjectRepository

    def exec(self):
        entries = self.time_entry_repository.get_current_week_entries()
        projects_dict = self.project_repository.get_projects()
        return entries, projects_dict
