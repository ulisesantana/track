from unittest.mock import Mock

from track.application.cases import GetTodayReportUseCase
from track.application.repositories import TimeEntryRepository
from track.core import Project


def return_today_report():
    today_entries = [
        {"duration": -60},
        {"duration": 120},
        {"duration": 180},
    ]
    projects_dict = {"project_1": Project(1, 'Test name')}
    time_entry_repository = Mock(spec=TimeEntryRepository)
    time_entry_repository.get_today_entries.return_value = today_entries
    time_entry_repository.get_projects.return_value = projects_dict
    case = GetTodayReportUseCase(time_entry_repository)

    entries, projects = case.exec()

    time_entry_repository.get_today_entries.assert_called_once()
    time_entry_repository.get_projects.assert_called_once()

    assert entries == today_entries
    assert projects == projects_dict
