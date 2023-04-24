import re
from datetime import datetime, timedelta
import time


def is_valid_toggl_id(input):
    pattern = r'^\d+$'
    return re.match(pattern, input)


def get_current_utc_date():
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S") + "+00:00"


def sum_durations(entries):
    total_duration = 0
    for entry in entries:
        duration = entry.get("duration", 0)
        if duration > 0:
            total_duration += duration
        else:
            total_duration += int(time.time()) + duration
    return total_duration


def seconds_to_hms_string(seconds):
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{add_zero_prefix(hours)}h {add_zero_prefix(minutes)}m {add_zero_prefix(seconds)}s"


def add_zero_prefix(number):
    return number if number > 9 else f"0{number}"


def get_week_dates(date):
    day_of_week = date.weekday()
    start_of_week = date - timedelta(days=day_of_week)
    end_of_week = start_of_week + timedelta(days=6)

    return start_of_week, end_of_week


def get_project_by_name(project, projects):
    for p in projects:
        if p['name'] == project:
            return p


def get_project_by_id(project_id, projects):
    for p in projects:
        if p['id'] == project_id:
            return p


def render_time_entry(entry, project):
    duration = entry['duration']
    if entry['duration'] < 0:
        duration = int(time.time()) + entry['duration']
    return f"{seconds_to_hms_string(duration)} - {entry['description']} ({project['name']})"
