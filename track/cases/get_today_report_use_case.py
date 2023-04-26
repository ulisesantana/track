from track import helpers
from track.repositories import TogglRepository


class GetTodayReportUseCase:
    def __init__(self, toggl_repository: TogglRepository):
        self.toggl_repository = toggl_repository

    def exec(self):
        entries = self.toggl_repository.get_today_entries()
        projects_dict = self.toggl_repository.get_projects()
        duration = helpers.sum_durations(entries)
        return duration, entries, projects_dict
