from track.core.helpers import (is_valid_id)


def test_is_valid_toggl_id():
    assert is_valid_id("123")
    assert not is_valid_id("abc")
    assert not is_valid_id("12a")
