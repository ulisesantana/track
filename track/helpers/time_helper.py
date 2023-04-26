from datetime import datetime


class TimeHelper:
    @staticmethod
    def get_current_utc_date():
        return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S") + "+00:00"
