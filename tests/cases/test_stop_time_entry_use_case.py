from unittest.mock import Mock

from tests.mocks import MockTimeHelper
from track.application.cases import StopTimeEntryUseCase
from track.core import TimeEntry
from track.infrastructure.repositories import TogglRepository


def test_stop_time_entry_use_case_exec():
    toggl_repository = Mock(spec=TogglRepository)
    current_entry = TimeEntry(id=1, wid=123, description="Reading emails", pid=123, _duration=60)
    expected = dict(id=current_entry.id, wid=current_entry.wid, description=current_entry.description,
                    stop=MockTimeHelper.get_current_utc_date())
    toggl_repository.get_current_entry.return_value = current_entry
    toggl_repository.update_entry.return_value = expected
    stop_time_entry_use_case = StopTimeEntryUseCase(toggl_repository, MockTimeHelper)

    result = stop_time_entry_use_case.exec()

    assert result == expected
    toggl_repository.get_current_entry.assert_called_once()
    toggl_repository.update_entry.assert_called_with(
        id=current_entry.id,
        wid=current_entry.wid,
        stop=MockTimeHelper.get_current_utc_date(),
    )


def test_stop_time_entry_use_case_exec_no_current_entry():
    toggl_repository = Mock(spec=TogglRepository)
    toggl_repository.get_current_entry.return_value = None
    stop_time_entry_use_case = StopTimeEntryUseCase(toggl_repository)

    result = stop_time_entry_use_case.exec()

    assert result is None
    toggl_repository.get_current_entry.assert_called_once()
    toggl_repository.update_entry.assert_not_called()
