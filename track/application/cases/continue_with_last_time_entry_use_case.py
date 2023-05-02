from dataclasses import dataclass

from track.application.repositories import TimeEntryRepository
from track.core.helpers import TimeHelper


@dataclass
class ContinueWithLastTimeEntryUseCase:
    time_entry_repository: TimeEntryRepository
    time_helper: TimeHelper = TimeHelper()

    def exec(self):
        last_entry = self.time_entry_repository.get_last_entry()
        if last_entry:
            return self.time_entry_repository.create_entry(
                id=last_entry.id,
                wid=last_entry.wid,
                description=last_entry.description,
                pid=last_entry.pid,
                start=self.time_helper.get_current_utc_date(),
            )
