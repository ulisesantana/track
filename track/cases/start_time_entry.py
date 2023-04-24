from track import helpers
from track.toggl_repository import TogglRepository


class StartTimeEntryUseCase:
    def __init__(self, toggl_repository: TogglRepository):
        self.toggl_repository = toggl_repository

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
            start=helpers.get_current_utc_date(),
        )

