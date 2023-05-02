from unittest.mock import Mock, patch

from track.core import Project
from track.infrastructure.repositories import TogglProjectRepository


def test_get_projects():
    with patch('requests.get') as mocked_get:
        # Mock the response for the GET request
        mocked_response = Mock()
        mocked_response.json.return_value = [
            {
                "id": 456,
                "name": "Test project",
            },
            {
                "id": 789,
                "name": "Test project 2",
            }
        ]
        mocked_get.return_value = mocked_response

        repository = TogglProjectRepository(workspace_id=123, token='test-token')
        projects = repository.get_projects()
        assert len(projects) == 2
        assert isinstance(projects[456], Project)
        assert projects[456].name == 'Test project'


def test_get_project_by_id():
    with patch('requests.get') as mocked_get:
        # Mock the response for the GET request
        mocked_response = Mock()
        mocked_response.json.return_value = {
            "id": 456,
            "name": "Test project",
        }
        mocked_get.return_value = mocked_response

        repository = TogglProjectRepository(workspace_id=123, token='test-token')
        project = repository.get_project_by_id(456)
        assert isinstance(project, Project)
        assert project.id == 456
        assert project.name == 'Test project'


def test_get_project_by_name():
    with patch('requests.get') as mocked_get:
        # Mock the response for the GET request
        mocked_response = Mock()
        mocked_response.json.return_value = [
            {
                "id": 456,
                "name": "Test project",
            },
            {
                "id": 789,
                "name": "Test project 2",
            }
        ]
        mocked_get.return_value = mocked_response

        repository = TogglProjectRepository(workspace_id=123, token='test-token')
        project = repository.get_project_by_name("Test project 2")
        assert isinstance(project, Project)
        assert project.id == 789
        assert project.name == 'Test project 2'
