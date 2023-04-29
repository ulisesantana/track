import os


class Config:
    @staticmethod
    def get_workspace_id():
        return int(os.environ.get('TOGGL_WORKSPACE_ID'))

    @staticmethod
    def get_default_project():
        return int(os.environ.get('TOGGL_DEFAULT_PROJECT'))

    @staticmethod
    def get_default_time_entry():
        return os.environ.get('TOGGL_DEFAULT_TIME_ENTRY')

    @staticmethod
    def get_token():
        return os.environ.get('TOGGL_API_TOKEN')
