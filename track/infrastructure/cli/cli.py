from dataclasses import dataclass
from typing import Callable

from track.application.cases import (
    ContinueWithLastTimeEntryUseCase,
    GetCurrentTimeEntryUseCase,
    GetCurrentWeekReportUseCase, GetTodayReportUseCase,
    StartTimeEntryUseCase,
    StopTimeEntryUseCase
)
from track.application.repositories import TimeEntryRepository
from track.infrastructure.cli.renderer import Renderer


@dataclass
class TrackCLI:
    time_entry_repository: TimeEntryRepository
    print: Callable

    def restart(self):
        """Continue with the last time entry.
        """
        case = ContinueWithLastTimeEntryUseCase(self.time_entry_repository)
        last_entry = case.exec()
        if last_entry:
            self.print(f"Continuing with '{last_entry.description}'")
        else:
            self.print("Error creating time entry.")

    def start(self, description, project):
        """Start a new time entry.
        """
        try:
            case = StartTimeEntryUseCase(self.time_entry_repository)
            case.exec(description, project)
            self.print(f"Starting with '{description}'")
        except Exception as e:
            self.print(e)
            self.print("Error creating entry time.")

    def stop(self):
        """Stop running time entry.
        """
        case = StopTimeEntryUseCase(self.time_entry_repository)
        stopped_time_entry = case.exec()
        if stopped_time_entry:
            self.print(f"Time entry '{stopped_time_entry.description}' stopped")
        else:
            self.print("There is no time entry running.")

    def current(self):
        """Show the current time entry.
        """
        case = GetCurrentTimeEntryUseCase(self.time_entry_repository)
        result = case.exec()
        if result:
            self.print(Renderer.render_time_entry(*result))
        else:
            self.print("There is no time entry running.")

    def today(self):
        """Show the total time tracked today.
        """
        case = GetTodayReportUseCase(self.time_entry_repository)
        entries, projects_dict = case.exec()
        self.print(Renderer.render_report(entries, projects_dict))

    def week(self):
        """Show the total time tracked this week.
        """
        case = GetCurrentWeekReportUseCase(self.time_entry_repository)
        entries, projects_dict = case.exec()
        self.print(Renderer.render_report(entries, projects_dict))
