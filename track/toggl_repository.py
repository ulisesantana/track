import time
from base64 import b64encode
from datetime import datetime, timedelta
from urllib.parse import urlencode

import requests

from track import helpers


class TogglRepository:
    def __init__(self, workspace_id: int, token: str, base_url: str = "https://api.track.toggl.com/api/v9"):
        self.workspace_id = workspace_id
        self.base_url = base_url
        self.basic_headers = {
            "content-type": "application/json",
            "Authorization": "Basic %s" % b64encode(token.encode()).decode("ascii"),
        }

    @staticmethod
    def format_to_toggl_date(date):
        return date.strftime("%Y-%m-%dT%H:%M:%S") + "+00:00"

    def get_current_entry(self):
        data = requests.get(
            f"{self.base_url}/me/time_entries/current",
            headers=self.basic_headers,
        )
        return data.json()

    def create_entry(self, **entry):
        requests.post(
            f"{self.base_url}/workspaces/{entry['wid']}/time_entries",
            headers=self.basic_headers,
            json={**entry, "created_with": "track CLI", "duration": int(time.time()) * -1},
        )

    def update_entry(self, **entry):
        requests.put(
            f"{self.base_url}/workspaces/{entry['wid']}/time_entries/{entry['id']}",
            headers=self.basic_headers,
            json=entry,
        )

    def get_current_week_entries(self):
        start, end = helpers.get_week_dates(datetime.today().date())
        query = {
            "start_date": self.format_to_toggl_date(start),
            "end_date": self.format_to_toggl_date(end + timedelta(days=1))
        }
        data = requests.get(
            f"{self.base_url}/me/time_entries?{urlencode(query)}",
            headers=self.basic_headers
        )
        return data.json()

    def get_today_entries(self):
        today = datetime.today().date()
        tomorrow = today + timedelta(days=1)
        query = {
            "start_date": self.format_to_toggl_date(today),
            "end_date": self.format_to_toggl_date(tomorrow)
        }
        data = requests.get(
            f"{self.base_url}/me/time_entries?{urlencode(query)}",
            headers=self.basic_headers
        )
        return data.json()

    def get_projects(self):
        data = requests.get(
            f"{self.base_url}/workspaces/{self.workspace_id}/projects",
            headers=self.basic_headers
        )
        return data.json()

    def get_project_by_name(self, project):
        projects = self.get_projects()
        return helpers.get_project_by_name(project, projects)

    def get_project_by_id(self, project_id):
        data = requests.get(
            f"{self.base_url}/workspaces/{self.workspace_id}/projects/{project_id}",
            headers=self.basic_headers
        )
        return data.json()
