from track.helpers import TimeHelper
from track.repositories import TogglRepository


class ContinueWithLastTimeEntryUseCase:
    def __init__(self, toggl_repository: TogglRepository, time_helper=TimeHelper()):
        self.toggl_repository = toggl_repository
        self.time_helper = time_helper

    def exec(self):
        last_entry = self.toggl_repository.get_last_entry()
        if last_entry:
            return self.toggl_repository.create_entry(
                id=last_entry["id"],
                wid=last_entry["wid"],
                description=last_entry["description"],
                pid=last_entry["pid"],
                start=self.time_helper.get_current_utc_date(),
            )