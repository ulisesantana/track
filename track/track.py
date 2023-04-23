import click
from datetime import datetime
from track import toggl
import time
import os

WORKSPACE_ID = os.environ.get('TOGGL_WORKSPACE_ID')
DEFAULT_TIME_ENTRY = os.environ.get('TOGGL_DEFAULT_TIME_ENTRY')
DEFAULT_PROJECT = os.environ.get('TOGGL_DEFAULT_PROJECT')

def get_current_utc_date():
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S") + "+00:00"


def sum_durations(entries):
    total_duration = 0
    for entry in entries:
        duration = entry.get("duration", 0)
        if duration > 0:
            total_duration += duration
        else:
            total_duration += int(time.time()) + duration
    return total_duration


def seconds_to_hms_string(seconds):
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours}h {minutes}m {seconds}s"


@click.group()
def track():
    pass


@click.command(name= "continue")
def restart():
    last_entry, *entries = toggl.get_current_week_entries()
    if last_entry:
        description = last_entry["description"]
        toggl.create_entry(
            id=last_entry["id"],
            wid=last_entry["wid"],
            description=description,
            pid=last_entry["pid"],
            start=get_current_utc_date(),
        )
        print(f"Continuing with '{description}'")
    else:
        print("Error creating time entry.")


@click.command()
@click.option(
    "--project",
    "-p",
    default=DEFAULT_PROJECT,
    help="Proyect you want to work with. It's Toggl Project ID",
)
@click.argument("description", required=False, default=DEFAULT_TIME_ENTRY)
def start(description, project):
    try:
        toggl.create_entry(
            wid=WORKSPACE_ID,
            description=description,
            pid=project,
            start=get_current_utc_date(),
        )
        print(f"Starting with '{description}'")
    except:
        print("Error creating entry time.")


@click.command()
def stop():
    current_entry = toggl.get_current_entry()
    if current_entry:
        toggl.update_entry(
            id=current_entry["id"],
            wid=current_entry["wid"],
            stop=get_current_utc_date(),
        )
        print(f"Time entry '{current_entry['description']}' stopped")
    else:
        print("There is no time entry running.")


@click.command()
def today():
    # Implementar la función para mostrar el tiempo trackeado hoy
    entries = toggl.get_today_entries()
    duration = sum_durations(entries)
    print(seconds_to_hms_string(duration))


@click.command()
def week():
    # Implementar la función para mostrar el tiempo trackeado hoy
    entries = toggl.get_current_week_entries()
    duration = sum_durations(entries)
    print(seconds_to_hms_string(duration))


track.add_command(restart)
track.add_command(start)
track.add_command(stop)
track.add_command(today)
track.add_command(week)

if __name__ == "__main__":
    track()
