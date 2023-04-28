from unittest.mock import Mock

from tests.mocks import MockTimeHelper
from track.application.cases import StartTimeEntryUseCase
from track.application.repositories import TimeEntryRepository
from track.core import Project


def test_start_time_entry_use_case_exec_with_valid_id():
    toggl_repository = Mock(TimeEntryRepository)
    toggl_repository.workspace_id = 42
    start_time_entry_use_case = StartTimeEntryUseCase(toggl_repository, MockTimeHelper)
    description = "Test description"
    project_id = 123

    start_time_entry_use_case.exec(description, project_id)

    toggl_repository.create_entry.assert_called_with(
        wid=toggl_repository.workspace_id,
        description=description,
        pid=project_id,
        start=MockTimeHelper.get_current_utc_date(),
    )


def test_start_time_entry_use_case_exec_with_project_name():
    toggl_repository = Mock(TimeEntryRepository)
    toggl_repository.workspace_id = 42
    start_time_entry_use_case = StartTimeEntryUseCase(toggl_repository, MockTimeHelper)
    description = "Test description"
    project = Project(id=123, name="Test project")
    toggl_repository.get_project_by_name.return_value = project

    start_time_entry_use_case.exec(description, project.name)

    toggl_repository.get_project_by_name.assert_called_with(project.name)
    toggl_repository.create_entry.assert_called_with(
        wid=toggl_repository.workspace_id,
        description=description,
        pid=project.id,
        start=MockTimeHelper.get_current_utc_date(),
    )
