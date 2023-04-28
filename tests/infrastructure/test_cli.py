from unittest.mock import Mock

import pytest

from track.application.repositories import TimeEntryRepository
from track.core import Project, TimeEntry, TimeEntryList
from track.infrastructure.cli import TrackCLI


@pytest.fixture
def time_entry_repository():
    repository = Mock(spec=TimeEntryRepository)
    repository.workspace_id = 123
    return repository


@pytest.fixture
def print_mock():
    return Mock(spec=print)


@pytest.fixture
def time_entry():
    return TimeEntry(id=1, wid=123, description="Test Description", pid=456, _duration=60)


@pytest.fixture
def project(time_entry):
    return Project(id=time_entry.pid, name="Test Project")


def test_restart(time_entry_repository, print_mock, time_entry):
    time_entry_repository.get_last_entry.return_value = time_entry
    time_entry_repository.create_entry.return_value = time_entry
    track_cli = TrackCLI(time_entry_repository, print_mock)

    track_cli.restart()

    print_mock.assert_called_with(f"Continuing with '{time_entry.description}'")


def test_start(print_mock, time_entry_repository, time_entry, project):
    track_cli = TrackCLI(time_entry_repository, print_mock)

    track_cli.start(time_entry.description, project)

    print_mock.assert_called_once_with(f"Starting with '{time_entry.description}'")


def test_stop(print_mock, time_entry_repository, time_entry):
    time_entry_repository.update_entry.return_value = time_entry
    track_cli = TrackCLI(time_entry_repository, print_mock)

    track_cli.stop()

    print_mock.assert_called_once_with(f"Time entry '{time_entry.description}' stopped")


def test_current_successfully(print_mock, time_entry_repository, time_entry, project):
    time_entry_repository.get_current_entry.return_value = time_entry
    time_entry_repository.get_project_by_id.return_value = project
    track_cli = TrackCLI(time_entry_repository, print_mock)

    track_cli.current()

    print_mock.assert_called_once_with(f"00h 01m 00s - {time_entry.description} ({project.name})")


def test_current_with_no_current_entry(print_mock, time_entry_repository, time_entry):
    time_entry_repository.get_current_entry.return_value = None
    track_cli = TrackCLI(time_entry_repository, print_mock)

    track_cli.current()

    print_mock.assert_called_once_with("There is no time entry running.")


def test_today(print_mock, time_entry_repository, time_entry, project):
    entries = TimeEntryList([time_entry, time_entry])
    projects_dict = dict([(project.id, project)])
    time_entry_repository.get_today_entries.return_value = entries
    time_entry_repository.get_projects.return_value = projects_dict
    track_cli = TrackCLI(time_entry_repository, print_mock)

    track_cli.today()

    print_mock.assert_called_once_with("""00h 02m 00s
  - 00h 01m 00s - Test Description (Test Project)
  - 00h 01m 00s - Test Description (Test Project)""")


def test_week(print_mock, time_entry_repository, time_entry, project):
    entries = TimeEntryList([time_entry, time_entry])
    projects_dict = dict([(project.id, project)])
    time_entry_repository.get_current_week_entries.return_value = entries
    time_entry_repository.get_projects.return_value = projects_dict
    track_cli = TrackCLI(time_entry_repository, print_mock)

    track_cli.week()

    print_mock.assert_called_once_with("""00h 02m 00s
  - 00h 01m 00s - Test Description (Test Project)
  - 00h 01m 00s - Test Description (Test Project)""")
