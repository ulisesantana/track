from unittest.mock import Mock, patch

from track.core import TimeEntry, TimeEntryList
from track.infrastructure.repositories import TogglTimeEntryRepository


def test_get_last_entry():
    with patch('requests.get') as mocked_get:
        # Mock the response for the GET request
        mocked_response = Mock()
        mocked_response.json.return_value = [
            {
                "id": 1,
                "wid": 123,
                "pid": 456,
                "description": "Test entry",
                "duration": 3600,
            }
        ]
        mocked_get.return_value = mocked_response

        repository = TogglTimeEntryRepository(workspace_id=123, token='test-token')
        last_entry = repository.get_last_entry()
        assert isinstance(last_entry, TimeEntry)
        assert last_entry.id == 1
        assert last_entry.description == 'Test entry'


def test_get_current_entry():
    with patch('requests.get') as mocked_get:
        # Mock the response for the GET request
        mocked_response = Mock()
        mocked_response.json.return_value = {
            "id": 2,
            "wid": 123,
            "pid": 456,
            "description": "Current entry",
            "duration": 7200,
        }
        mocked_get.return_value = mocked_response

        repository = TogglTimeEntryRepository(workspace_id=123, token='test-token')
        current_entry = repository.get_current_entry()
        assert isinstance(current_entry, TimeEntry)
        assert current_entry.id == 2
        assert current_entry.description == 'Current entry'


def test_create_entry():
    with patch('requests.post') as mocked_post:
        # Mock the response for the POST request
        mocked_response = Mock()
        mocked_response.json.return_value = {
            "id": 3,
            "wid": 123,
            "pid": 789,
            "description": "New entry",
            "duration": 1800,
        }
        mocked_post.return_value = mocked_response

        repository = TogglTimeEntryRepository(workspace_id=123, token='test-token')
        created_entry = repository.create_entry(wid=123, pid=789, description="New entry")
        assert isinstance(created_entry, TimeEntry)
        assert created_entry.id == 3
        assert created_entry.description == 'New entry'


def test_update_entry():
    with patch('requests.put') as mocked_put:
        # Mock the response for the PUT request
        mocked_response = Mock()
        mocked_response.json.return_value = {
            "id": 4,
            "wid": 123,
            "pid": 456,
            "description": "Updated entry",
            "duration": 900,
        }
        mocked_put.return_value = mocked_response

        repository = TogglTimeEntryRepository(workspace_id=123, token='test-token')
        updated_entry = repository.update_entry(id=4, wid=123, pid=456, description="Updated entry", duration=900)
        assert isinstance(updated_entry, TimeEntry)
        assert updated_entry.id == 4
        assert updated_entry.description == 'Updated entry'


def test_get_current_week_entries():
    with patch('requests.get') as mocked_get:
        # Mock the response for the GET request
        mocked_response = Mock()
        mocked_response.json.return_value = [
            {
                "id": 5,
                "wid": 123,
                "pid": 456,
                "description": "Week entry 1",
                "duration": 1800,
            },
            {
                "id": 6,
                "wid": 123,
                "pid": 789,
                "description": "Week entry 2",
                "duration": 3600,
            }
        ]
        mocked_get.return_value = mocked_response

        repository = TogglTimeEntryRepository(workspace_id=123, token='test-token')
        week_entries = repository.get_current_week_entries()
        assert isinstance(week_entries, TimeEntryList)
        assert len(week_entries.values) == 2
        assert week_entries.values[0].id == 5
        assert week_entries.values[1].id == 6


def test_get_today_entries():
    with patch('requests.get') as mocked_get:
        # Mock the response for the GET request
        mocked_response = Mock()
        mocked_response.json.return_value = [
            {
                "id": 7,
                "wid": 123,
                "pid": 456,
                "description": "Today entry",
                "duration": 2700,
            },
            {
                "id": 8,
                "wid": 123,
                "pid": 789,
                "description": "Today entry 2",
                "duration": 4500,
            }
        ]
        mocked_get.return_value = mocked_response

        repository = TogglTimeEntryRepository(workspace_id=123, token='test-token')
        today_entries = repository.get_today_entries()
        assert isinstance(today_entries, TimeEntryList)
        assert len(today_entries.values) == 2
        assert today_entries.values[0].id == 7
        assert today_entries.values[1].id == 8
