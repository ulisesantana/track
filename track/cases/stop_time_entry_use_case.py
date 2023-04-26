from track.helpers import TimeHelper
from track.repositories import TogglRepository


class StopTimeEntryUseCase:
    def __init__(self, toggl_repository: TogglRepository, time_helper: TimeHelper = TimeHelper()):
        self.toggl_repository = toggl_repository
        self.time_helper = time_helper

    def exec(self):
        current_entry = self.toggl_repository.get_current_entry()
        if current_entry:
            return self.toggl_repository.update_entry(
                id=current_entry["id"],
                wid=current_entry["wid"],
                stop=self.time_helper.get_current_utc_date(),
            )
