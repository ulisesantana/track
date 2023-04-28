import re

from .time_helper import TimeHelper


def is_valid_id(input):
    pattern = r'^\d+$'
    return re.match(pattern, input)
