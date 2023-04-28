from unittest.mock import Mock

from track.application.cases import GetCurrentWeekReportUseCase
from track.application.repositories import TimeEntryRepository
from track.core import Project


def test_get_current_week_report_use_case_exec():
    dummy_entries = [
        {"duration": 3600},
        {"duration": 1800},
    ]
    projects_dict = {"project_1": Project(1, 'Test name')}
    time_entry_repository = Mock(spec=TimeEntryRepository)
    time_entry_repository.get_current_week_entries.return_value = dummy_entries
    time_entry_repository.get_projects.return_value = projects_dict
    use_case = GetCurrentWeekReportUseCase(time_entry_repository=time_entry_repository)

    entries, projects = use_case.exec()

    time_entry_repository.get_current_week_entries.assert_called_once()
    assert entries == dummy_entries
    assert projects == projects_dict
