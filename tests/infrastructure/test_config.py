import os
from unittest.mock import patch

from track.infrastructure import Config


def test_get_workspace_id():
    with patch.dict(os.environ, {'TOGGL_WORKSPACE_ID': '1234'}):
        workspace_id = Config.get_workspace_id()
        assert workspace_id == 1234


def test_get_default_project():
    with patch.dict(os.environ, {'TOGGL_DEFAULT_PROJECT': '5678'}):
        default_project = Config.get_default_project()
        assert default_project == 5678


def test_get_default_time_entry():
    with patch.dict(os.environ, {'TOGGL_DEFAULT_TIME_ENTRY': 'Test time entry'}):
        default_time_entry = Config.get_default_time_entry()
        assert default_time_entry == 'Test time entry'


def test_get_token():
    with patch.dict(os.environ, {'TOGGL_API_TOKEN': 'test-token'}):
        token = Config.get_token()
        assert token == 'test-token'
