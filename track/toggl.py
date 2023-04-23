import requests
import os
from base64 import b64encode
from urllib.parse import urlencode
from pprint import pprint
import time
from datetime import datetime, timedelta
from track import week_helper

BASE_URL = "https://api.track.toggl.com/api/v9"
TOKEN = os.environ.get('TOGGL_API_TOKEN')
API_TOKEN = b64encode(TOKEN.encode()).decode("ascii")

def format_to_toggl_date(date):
    return date.strftime("%Y-%m-%dT%H:%M:%S") + "+00:00"


def get_current_entry():
    data = requests.get(
        f"{BASE_URL}/me/time_entries/current",
        headers={
            "content-type": "application/json",
            "Authorization": "Basic %s" % API_TOKEN,
        },
    )
    return data.json()


def create_entry(**entry):
    data = requests.post(
        f"{BASE_URL}/workspaces/{entry['wid']}/time_entries",
        headers={
            "content-type": "application/json",
            "Authorization": "Basic %s" % API_TOKEN,
        },
        json={**entry, "created_with": "track CLI", "duration": int(time.time()) * -1},
    )


def update_entry(**entry):
    requests.put(
        f"{BASE_URL}/workspaces/{entry['wid']}/time_entries/{entry['id']}",
        headers={
            "content-type": "application/json",
            "Authorization": "Basic %s" % API_TOKEN,
        },
        json=entry,
    )


def get_current_week_entries():
    start, end = week_helper.get_week_dates(datetime.today().date())
    query = {
        "start_date": format_to_toggl_date(start),
        "end_date": format_to_toggl_date(end + timedelta(days=1))
    }
    data = requests.get(
        f"{BASE_URL}/me/time_entries?{urlencode(query)}",
        headers={
            "content-type": "application/json",
            "Authorization": "Basic %s" % API_TOKEN,
        }
    )
    return data.json()

def get_today_entries():
    today = datetime.today().date()
    tomorrow = today + timedelta(days=1)
    query = {
        "start_date": format_to_toggl_date(today),
        "end_date": format_to_toggl_date(tomorrow)
    }
    data = requests.get(
        f"{BASE_URL}/me/time_entries?{urlencode(query)}",
        headers={
            "content-type": "application/json",
            "Authorization": "Basic %s" % API_TOKEN,
        }
    )
    return data.json()


# curl -u <email>:<password> \
#   -H "Content-Type: application/json" \
#   -d '{"created_with":"API example code",
# "pid":null,"tid":null,
# "description":"Hello Toggl","tags":[],"billable":false,"duration":-1654686174,"wid":1,
# "at":"1984-06-08T11:02:53.836Z",
# "start":"1984-06-08T11:02:53.000Z",
# "stop":null}' \
#   -X POST https://api.track.toggl.com/api/v9/time_entries
