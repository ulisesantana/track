import time
from base64 import b64encode
from datetime import datetime, timedelta
from urllib.parse import urlencode

import requests

from track.application.repositories import TimeEntryRepository
from track.core import TimeEntry, TimeEntryList
from track.core.helpers import TimeHelper


class TogglTimeEntryRepository(TimeEntryRepository):
    def __init__(self, workspace_id: int, token: str, base_url: str = "https://api.track.toggl.com/api/v9"):
        self.workspace_id = workspace_id
        self.base_url = base_url
        self.basic_headers = {
            "content-type": "application/json",
            "Authorization": "Basic %s" % b64encode(token.encode()).decode("ascii"),
        }

    def get_last_entry(self):
        data = requests.get(
            f"{self.base_url}/me/time_entries",
            headers=self.basic_headers,
        )
        last_entry, *entries = data.json()
        return TogglTimeEntryRepository._map_to_time_entry(**last_entry)

    def get_current_entry(self):
        data = requests.get(
            f"{self.base_url}/me/time_entries/current",
            headers=self.basic_headers,
        )
        result = data.json()
        if result:
            return TogglTimeEntryRepository._map_to_time_entry(**data.json())

    def create_entry(self, **entry):
        data = requests.post(
            f"{self.base_url}/workspaces/{entry['wid']}/time_entries",
            headers=self.basic_headers,
            json={**entry, "created_with": "track CLI", "duration": int(time.time()) * -1},
        )
        return TogglTimeEntryRepository._map_to_time_entry(**data.json())

    def update_entry(self, **entry):
        data = requests.put(
            f"{self.base_url}/workspaces/{entry['wid']}/time_entries/{entry['id']}",
            headers=self.basic_headers,
            json=entry,
        )
        return TogglTimeEntryRepository._map_to_time_entry(**data.json())

    def get_current_week_entries(self):
        start, end = TimeHelper.get_week_dates(datetime.today().date())
        query = {
            "start_date": TogglTimeEntryRepository._format_to_toggl_date(start),
            "end_date": TogglTimeEntryRepository._format_to_toggl_date(end + timedelta(days=1))
        }
        data = requests.get(
            f"{self.base_url}/me/time_entries?{urlencode(query)}",
            headers=self.basic_headers
        )
        return TogglTimeEntryRepository._map_to_time_entry_list(data.json())

    def get_today_entries(self):
        today = datetime.today().date()
        tomorrow = today + timedelta(days=1)
        query = {
            "start_date": TogglTimeEntryRepository._format_to_toggl_date(today),
            "end_date": TogglTimeEntryRepository._format_to_toggl_date(tomorrow)
        }
        data = requests.get(
            f"{self.base_url}/me/time_entries?{urlencode(query)}",
            headers=self.basic_headers
        )
        return TogglTimeEntryRepository._map_to_time_entry_list(data.json())

    @staticmethod
    def _map_to_time_entry(**raw_entry):
        return TimeEntry(
            id=raw_entry["id"],
            wid=raw_entry["wid"],
            pid=raw_entry["pid"],
            description=raw_entry["description"],
            _duration=raw_entry["duration"],
        )

    @staticmethod
    def _map_to_time_entry_list(raw_entries):
        return TimeEntryList(values=[TogglTimeEntryRepository._map_to_time_entry(**x) for x in raw_entries])

    @staticmethod
    def _format_to_toggl_date(date):
        return date.strftime("%Y-%m-%dT%H:%M:%S") + "+00:00"
