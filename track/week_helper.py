import datetime

def get_week_dates(date):
    """
    Function that returns the start and end dates of the week for a given date.
    Each week runs from Monday to Sunday.
    """
    # Get the day of the week for the given date (0 is Monday, 6 is Sunday)
    day_of_week = date.weekday()
    
    # Calculate the start date of the week by subtracting the number of days from the day of the week
    start_of_week = date - datetime.timedelta(days=day_of_week)
    
    # Calculate the end date of the week by adding the remaining days until Sunday
    end_of_week = start_of_week + datetime.timedelta(days=6)
    
    return start_of_week, end_of_week
