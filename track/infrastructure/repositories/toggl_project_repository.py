from base64 import b64encode

import requests

from track.application.repositories import ProjectRepository
from track.core import Project


class TogglProjectRepository(ProjectRepository):
    def __init__(self, workspace_id: int, token: str, base_url: str = "https://api.track.toggl.com/api/v9"):
        self.workspace_id = workspace_id
        self.base_url = base_url
        self.basic_headers = {
            "content-type": "application/json",
            "Authorization": "Basic %s" % b64encode(token.encode()).decode("ascii"),
        }

    def get_projects(self):
        data = requests.get(
            f"{self.base_url}/workspaces/{self.workspace_id}/projects",
            headers=self.basic_headers
        )
        project_dict = {}
        for project in data.json():
            project_dict[project["id"]] = TogglProjectRepository._map_to_project(**project)
        return project_dict

    def get_project_by_id(self, project_id: int) -> Project:
        data = requests.get(
            f"{self.base_url}/workspaces/{self.workspace_id}/projects/{project_id}",
            headers=self.basic_headers
        )
        result = data.json()
        if result:
            return TogglProjectRepository._map_to_project(**data.json())

    def get_project_by_name(self, project_name):
        projects = self.get_projects()
        return self._filter_project_by_name(project_name, projects)

    @staticmethod
    def _filter_project_by_name(project, projects):
        for p in projects.values():
            if p.name == project:
                return p

    @staticmethod
    def _map_to_project(**raw_project):
        return Project(
            id=raw_project["id"],
            name=raw_project["name"]
        )
