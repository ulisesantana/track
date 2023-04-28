from track.application.repositories import TimeEntryRepository


class GetCurrentTimeEntryUseCase:
    def __init__(self, time_entry_repository: TimeEntryRepository):
        self.time_entry_repository = time_entry_repository

    def exec(self):
        current_entry = self.time_entry_repository.get_current_entry()
        if current_entry:
            project = self.time_entry_repository.get_project_by_id(current_entry.pid)
            return current_entry, project
