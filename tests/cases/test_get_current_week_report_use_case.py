from unittest.mock import Mock

import pytest

from track.application.cases import GetCurrentWeekReportUseCase
from track.application.repositories import ProjectRepository, TimeEntryRepository
from track.core import Project


@pytest.fixture
def time_entry_repository():
    repository = Mock(spec=TimeEntryRepository)
    repository.workspace_id = 123
    return repository


@pytest.fixture
def project_repository():
    repository = Mock(spec=ProjectRepository)
    repository.workspace_id = 123
    return repository


def test_get_current_week_report_use_case_exec(time_entry_repository, project_repository):
    dummy_entries = [
        {"duration": 3600},
        {"duration": 1800},
    ]
    projects_dict = {"project_1": Project(1, 'Test name')}
    time_entry_repository.get_current_week_entries.return_value = dummy_entries
    project_repository.get_projects.return_value = projects_dict
    use_case = GetCurrentWeekReportUseCase(time_entry_repository=time_entry_repository,
                                           project_repository=project_repository)

    entries, projects = use_case.exec()

    time_entry_repository.get_current_week_entries.assert_called_once()
    assert entries == dummy_entries
    assert projects == projects_dict
