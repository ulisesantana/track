import time

from track.helpers import (add_zero_prefix, get_project_by_id, get_project_by_name, is_valid_toggl_id,
                           render_time_entry, seconds_to_hms_string, sum_durations)


def test_is_valid_toggl_id():
    assert is_valid_toggl_id("123")
    assert not is_valid_toggl_id("abc")
    assert not is_valid_toggl_id("12a")


def test_sum_durations():
    entries = [
        {"duration": 60},
        {"duration": -120},
    ]
    assert sum_durations(entries) == 60 - 120 + int(time.time())


def test_seconds_to_hms_string():
    assert seconds_to_hms_string(3665) == "01h 01m 05s"
    assert seconds_to_hms_string(0) == "00h 00m 00s"
    assert seconds_to_hms_string(3599) == "00h 59m 59s"


def test_add_zero_prefix():
    assert add_zero_prefix(5) == "05"
    assert add_zero_prefix(0) == "00"
    assert add_zero_prefix(15) == 15


def test_get_project_by_name():
    projects = [
        {"name": "Project1", "id": 1},
        {"name": "Project2", "id": 2},
    ]
    assert get_project_by_name("Project1", projects) == {"name": "Project1", "id": 1}
    assert get_project_by_name("Project3", projects) is None


def test_get_project_by_id():
    projects = [
        {"name": "Project1", "id": 1},
        {"name": "Project2", "id": 2},
    ]
    assert get_project_by_id(1, projects) == {"name": "Project1", "id": 1}
    assert get_project_by_id(3, projects) is None


def test_render_time_entry():
    entry = {"description": "Task1", "duration": 60}
    project = {"name": "Project1"}
    assert render_time_entry(entry, project) == "00h 01m 00s - Task1 (Project1)"
