from track.application.repositories import TimeEntryRepository
from track.core.helpers import TimeHelper


class StopTimeEntryUseCase:
    def __init__(self, time_entry_repositoy: TimeEntryRepository, time_helper: TimeHelper = TimeHelper()):
        self.time_entry_repository = time_entry_repositoy
        self.time_helper = time_helper

    def exec(self):
        current_entry = self.time_entry_repository.get_current_entry()
        if current_entry:
            return self.time_entry_repository.update_entry(
                id=current_entry.id,
                wid=current_entry.wid,
                stop=self.time_helper.get_current_utc_date(),
            )
