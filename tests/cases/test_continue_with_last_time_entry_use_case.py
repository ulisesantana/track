from unittest.mock import MagicMock

from tests.mocks import MockTimeHelper
from track.cases import ContinueWithLastTimeEntryUseCase
from track.repositories import TogglRepository


def test_continue_with_last_time_entry_use_case_exec():
    toggl_repository = MagicMock(spec=TogglRepository)
    last_entry = {
        "id": 1,
        "wid": 123,
        "description": "Test Description",
        "pid": 456,
    }
    toggl_repository.get_last_entry.return_value = last_entry
    expected = {**last_entry, "start": MockTimeHelper.get_current_utc_date()}
    toggl_repository.create_entry.return_value = expected
    case = ContinueWithLastTimeEntryUseCase(toggl_repository, MockTimeHelper)

    result = case.exec()

    assert result is expected
    toggl_repository.get_last_entry.assert_called_once()
    toggl_repository.create_entry.assert_called_with(**expected)


def test_continue_with_last_time_entry_use_case_exec_no_last_entry():
    toggl_repository = MagicMock(spec=TogglRepository)
    toggl_repository.get_last_entry.return_value = None
    continue_with_last_time_entry_use_case = ContinueWithLastTimeEntryUseCase(toggl_repository, MockTimeHelper)

    result = continue_with_last_time_entry_use_case.exec()

    assert result is None
    toggl_repository.get_last_entry.assert_called_once()
    toggl_repository.create_entry.assert_not_called()
