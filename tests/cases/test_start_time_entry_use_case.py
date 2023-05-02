from unittest.mock import Mock

import pytest

from tests.mocks import MockTimeHelper
from track.application.cases import StartTimeEntryUseCase
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


def test_start_time_entry_use_case_exec_with_valid_id(time_entry_repository, project_repository):
    start_time_entry_use_case = StartTimeEntryUseCase(time_entry_repository=time_entry_repository,
                                                      project_repository=project_repository, time_helper=MockTimeHelper)
    description = "Test description"
    project_id = 123

    start_time_entry_use_case.exec(description, project_id)

    time_entry_repository.create_entry.assert_called_with(
        wid=time_entry_repository.workspace_id,
        description=description,
        pid=project_id,
        start=MockTimeHelper.get_current_utc_date(),
    )


def test_start_time_entry_use_case_exec_with_project_name(time_entry_repository, project_repository):
    start_time_entry_use_case = StartTimeEntryUseCase(time_entry_repository=time_entry_repository,
                                                      project_repository=project_repository, time_helper=MockTimeHelper)
    description = "Test description"
    project = Project(id=123, name="Test project")
    project_repository.get_project_by_name.return_value = project

    start_time_entry_use_case.exec(description, project.name)

    project_repository.get_project_by_name.assert_called_with(project.name)
    time_entry_repository.create_entry.assert_called_with(
        wid=time_entry_repository.workspace_id,
        description=description,
        pid=project.id,
        start=MockTimeHelper.get_current_utc_date(),
    )
