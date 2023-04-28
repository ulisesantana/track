from track.core import helpers
from track.application.repositories import TimeEntryRepository
from track.core.helpers import TimeHelper


class StartTimeEntryUseCase:
    def __init__(self, time_entry_repository: TimeEntryRepository, time_helper: TimeHelper = TimeHelper()):
        self.time_entry_repository = time_entry_repository
        self.time_helper = time_helper

    def exec(self, description, project):
        if helpers.is_valid_id(str(project)):
            project_id = project
        else:
            p = self.time_entry_repository.get_project_by_name(project)
            project_id = p.id
        self.time_entry_repository.create_entry(
            wid=self.time_entry_repository.workspace_id,
            description=description,
            pid=project_id,
            start=self.time_helper.get_current_utc_date(),
        )

