import time
from unittest.mock import Mock

import pytest

from track.application.cases import GetCurrentTimeEntryUseCase
from track.application.repositories import ProjectRepository, TimeEntryRepository
from track.core import Project, TimeEntry


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


def test_return_current_time_entry_successfully(time_entry_repository, project_repository):
    current_entry = TimeEntry(id=1, wid=123, _duration=-100, pid=456, description="Test")
    project = Project(id=456, name="Test Project")
    time_entry_repository.get_current_entry.return_value = current_entry
    project_repository.get_project_by_id.return_value = project
    get_current_time_entry_use_case = GetCurrentTimeEntryUseCase(time_entry_repository=time_entry_repository,
                                                                 project_repository=project_repository)

    result = get_current_time_entry_use_case.exec()

    time_entry_repository.get_current_entry.assert_called_once()
    project_repository.get_project_by_id.assert_called_with(current_entry.pid)

    assert result == (current_entry, project)
    assert current_entry.duration >= int(time.time()) - 100


def test_return_none_if_there_is_no_current_entry(time_entry_repository, project_repository):
    get_current_time_entry_use_case = GetCurrentTimeEntryUseCase(time_entry_repository, project_repository)
    time_entry_repository.get_current_entry.return_value = None

    result = get_current_time_entry_use_case.exec()

    time_entry_repository.get_current_entry.assert_called_once()
    project_repository.get_project_by_id.assert_not_called()
    assert result is None
