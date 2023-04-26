import time
from unittest.mock import MagicMock

from track.cases import GetCurrentTimeEntryUseCase
from track.repositories import TogglRepository


def test_return_current_time_entry_successfully():
    toggl_repository = MagicMock(spec=TogglRepository)
    current_entry = {
        "id": 1,
        "wid": 123,
        "duration": -100,
        "pid": 456,
    }
    project = {
        "id": 456,
        "name": "Test Project",
    }
    toggl_repository.get_current_entry.return_value = current_entry
    toggl_repository.get_project_by_id.return_value = project
    get_current_time_entry_use_case = GetCurrentTimeEntryUseCase(toggl_repository)

    result = get_current_time_entry_use_case.exec()

    toggl_repository.get_current_entry.assert_called_once()
    toggl_repository.get_project_by_id.assert_called_with(current_entry["pid"])

    assert result == (current_entry, project)
    assert current_entry["duration"] >= int(time.time()) - 100


def test_return_none_if_there_is_no_current_entry():
    toggl_repository = MagicMock(spec=TogglRepository)
    get_current_time_entry_use_case = GetCurrentTimeEntryUseCase(toggl_repository)
    toggl_repository.get_current_entry.return_value = None

    result = get_current_time_entry_use_case.exec()

    toggl_repository.get_current_entry.assert_called_once()
    toggl_repository.get_project_by_id.assert_not_called()
    assert result is None
