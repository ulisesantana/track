from track.helpers import TimeHelper


class MockTimeHelper(TimeHelper):
    @staticmethod
    def get_current_utc_date():
        return "2023-05-01T00:00:00Z"
