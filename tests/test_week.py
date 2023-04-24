import datetime
from track import helpers


def test_get_week_dates():
    monday = datetime.date(2023, 4, 24)
    sunday = datetime.date(2023, 4, 30)
    # Test case 1: Monday
    date1 = monday
    start1, end1 = helpers.get_week_dates(date1)
    assert start1 == monday
    assert end1 == sunday

    # Test case 2: Wednesday
    date2 = datetime.date(2023, 4, 26)
    start2, end2 = helpers.get_week_dates(date2)
    assert start2 == monday
    assert end2 == sunday

    # Test case 3: Sunday
    date3 = sunday
    start3, end3 = helpers.get_week_dates(date3)
    assert start3 == monday
    assert end3 == sunday

    # Test case 4: New Year (January 1st)
    date4 = datetime.date(2023, 1, 1)
    start4, end4 = helpers.get_week_dates(date4)
    assert start4 == datetime.date(2022, 12, 26)
    assert end4 == datetime.date(2023, 1, 1)
