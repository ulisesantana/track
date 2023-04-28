from track.application.repositories import TimeEntryRepository


class GetCurrentWeekReportUseCase:
    def __init__(self, time_entry_repository: TimeEntryRepository):
        self.time_entry_repository = time_entry_repository

    def exec(self):
        entries = self.time_entry_repository.get_current_week_entries()
        projects_dict = self.time_entry_repository.get_projects()
        return entries, projects_dict
