from unittest.mock import MagicMock

from track import helpers
from track.cases import GetTodayReportUseCase
from track.repositories import TogglRepository


def return_today_report():
    today_entries = [
        {"duration": 60},
        {"duration": 120},
        {"duration": 180},
    ]
    projects_dict = {"project_1": {"id": 1, "name": "Project 1"}}
    toggl_repository = MagicMock(spec=TogglRepository)
    toggl_repository.get_today_entries.return_value = today_entries
    toggl_repository.get_projects.return_value = projects_dict
    case = GetTodayReportUseCase(toggl_repository)

    duration, entries, projects = case.exec()

    toggl_repository.get_today_entries.assert_called_once()
    toggl_repository.get_projects.assert_called_once()

    assert duration == helpers.sum_durations(today_entries)
    assert entries == today_entries
    assert projects == projects_dict
