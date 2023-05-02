from unittest.mock import Mock

import pytest

from tests.mocks import MockTimeHelper
from track.application.cases import ContinueWithLastTimeEntryUseCase
from track.application.repositories import TimeEntryRepository
from track.core import TimeEntry


@pytest.fixture
def time_entry_repository():
    repository = Mock(spec=TimeEntryRepository)
    repository.workspace_id = 123
    return repository


def test_continue_with_last_time_entry_use_case_exec(time_entry_repository):
    last_entry = TimeEntry(id=1, wid=123, description="Test Description", pid=456, _duration=60)
    time_entry_repository.get_last_entry.return_value = last_entry
    expected_call = dict(start=MockTimeHelper.get_current_utc_date(), id=last_entry.id, wid=last_entry.wid,
                         description=last_entry.description, pid=last_entry.pid)
    expected = TimeEntry(id=last_entry.id, wid=last_entry.wid,
                         description=last_entry.description, pid=last_entry.pid,
                         _duration=-60)
    time_entry_repository.create_entry.return_value = expected
    case = ContinueWithLastTimeEntryUseCase(time_entry_repository=time_entry_repository, time_helper=MockTimeHelper)

    result = case.exec()

    assert result is expected
    time_entry_repository.get_last_entry.assert_called_once()
    time_entry_repository.create_entry.assert_called_with(**expected_call)


def test_continue_with_last_time_entry_use_case_exec_no_last_entry(time_entry_repository):
    time_entry_repository.get_last_entry.return_value = None
    continue_with_last_time_entry_use_case = ContinueWithLastTimeEntryUseCase(
        time_entry_repository=time_entry_repository, time_helper=MockTimeHelper)

    result = continue_with_last_time_entry_use_case.exec()

    assert result is None
    time_entry_repository.get_last_entry.assert_called_once()
    time_entry_repository.create_entry.assert_not_called()
