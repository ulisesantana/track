import time

from track.core import TimeEntry


def test_time_entry_initialization():
    time_entry = TimeEntry(1, 100, 200, "Prueba de descripción", 3600)

    assert time_entry.id == 1
    assert time_entry.pid == 100
    assert time_entry.wid == 200
    assert time_entry.description == "Prueba de descripción"
    assert time_entry.duration == 3600


def test_time_entry_str():
    time_entry = TimeEntry(1, 100, 200, "Prueba de descripción", 3600)

    expected_str = "01h 00m 00s - Prueba de descripción"
    assert str(time_entry) == expected_str

    time_entry.duration = int(time.time() - 3665) * -1
    expected_str = "01h 01m 05s - Prueba de descripción"
    assert str(time_entry) == expected_str
