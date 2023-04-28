from track.application.repositories import TimeEntryRepository


class GetTodayReportUseCase:
    def __init__(self, time_entry_repository: TimeEntryRepository):
        self.time_entry_repository = time_entry_repository

    def exec(self):
        entries = self.time_entry_repository.get_today_entries()
        projects_dict = self.time_entry_repository.get_projects()
        return entries, projects_dict
