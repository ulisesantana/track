from unittest.mock import MagicMock

from tests.mocks import MockTimeHelper
from track.cases.start_time_entry_use_case import StartTimeEntryUseCase
from track.repositories.toggl_repository import TogglRepository


def test_start_time_entry_use_case_exec_with_valid_id():
    toggl_repository = MagicMock(TogglRepository)
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
    toggl_repository = MagicMock(TogglRepository)
    toggl_repository.workspace_id = 42
    start_time_entry_use_case = StartTimeEntryUseCase(toggl_repository, MockTimeHelper)
    description = "Test description"
    project_name = "Test project"
    project_id = 123
    project_data = {"id": project_id}
    toggl_repository.get_project_by_name.return_value = project_data

    start_time_entry_use_case.exec(description, project_name)

    toggl_repository.get_project_by_name.assert_called_with(project_name)
    toggl_repository.create_entry.assert_called_with(
        wid=toggl_repository.workspace_id,
        description=description,
        pid=project_id,
        start=MockTimeHelper.get_current_utc_date(),
    )
