from track import helpers
from track.helpers import TimeHelper
from track.repositories import TogglRepository


class StartTimeEntryUseCase:
    def __init__(self, toggl_repository: TogglRepository, time_helper: TimeHelper = TimeHelper()):
        self.toggl_repository = toggl_repository
        self.time_helper = time_helper

    def exec(self, description, project):
        if helpers.is_valid_toggl_id(str(project)):
            project_id = project
        else:
            p = self.toggl_repository.get_project_by_name(project)
            project_id = p['id']
        self.toggl_repository.create_entry(
            wid=self.toggl_repository.workspace_id,
            description=description,
            pid=project_id,
            start=self.time_helper.get_current_utc_date(),
        )

