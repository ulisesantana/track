from dataclasses import dataclass

from track.application.repositories import TimeEntryRepository
from track.application.repositories.project_repository import ProjectRepository
from track.core import helpers
from track.core.helpers import TimeHelper


@dataclass
class StartTimeEntryUseCase:
    time_entry_repository: TimeEntryRepository
    project_repository: ProjectRepository
    time_helper: TimeHelper = TimeHelper()

    def exec(self, description, project):
        if helpers.is_valid_id(str(project)):
            project_id = project
        else:
            p = self.project_repository.get_project_by_name(project)
            project_id = p.id
        self.time_entry_repository.create_entry(
            wid=self.time_entry_repository.workspace_id,
            description=description,
            pid=project_id,
            start=self.time_helper.get_current_utc_date(),
        )
