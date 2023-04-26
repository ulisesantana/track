import time

from track.repositories import TogglRepository


class GetCurrentTimeEntryUseCase:
    def __init__(self, toggl_repository: TogglRepository):
        self.toggl_repository = toggl_repository

    def exec(self):
        current_entry = self.toggl_repository.get_current_entry()
        if current_entry:
            current_entry["duration"] = int(time.time()) + current_entry['duration']
            project = self.toggl_repository.get_project_by_id(current_entry['pid'])
            return current_entry, project
