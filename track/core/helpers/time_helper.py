from datetime import datetime, timedelta


class TimeHelper:
    @staticmethod
    def get_current_utc_date():
        return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S") + "+00:00"

    @staticmethod
    def seconds_to_hms_string(seconds):
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{TimeHelper._add_zero_prefix(hours)}h {TimeHelper._add_zero_prefix(minutes)}m {TimeHelper._add_zero_prefix(seconds)}s"

    @staticmethod
    def _add_zero_prefix(number):
        return number if number > 9 else f"0{number}"

    @staticmethod
    def get_week_dates(date):
        day_of_week = date.weekday()
        start_of_week = date - timedelta(days=day_of_week)
        end_of_week = start_of_week + timedelta(days=6)

        return start_of_week, end_of_week

