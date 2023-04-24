import os
import time

import click

from track import helpers, toggl
from track.cases.start_time_entry import StartTimeEntryUseCase
from track.toggl_repository import TogglRepository

WORKSPACE_ID = int(os.environ.get('TOGGL_WORKSPACE_ID'))
DEFAULT_PROJECT = int(os.environ.get('TOGGL_DEFAULT_PROJECT'))
DEFAULT_TIME_ENTRY = os.environ.get('TOGGL_DEFAULT_TIME_ENTRY')
TOKEN = os.environ.get('TOGGL_API_TOKEN')
toggl_repository = TogglRepository(workspace_id=WORKSPACE_ID, token=TOKEN)


@click.group()
def cli():
    pass


@click.command(name="continue")
def restart():
    """Continue with the last time entry.
    """
    last_entry, *entries = toggl.get_current_week_entries()
    if last_entry:
        description = last_entry["description"]
        toggl.create_entry(
            id=last_entry["id"],
            wid=last_entry["wid"],
            description=description,
            pid=last_entry["pid"],
            start=helpers.get_current_utc_date(),
        )
        click.echo(f"Continuing with '{description}'")
    else:
        click.echo("Error creating time entry.")


@click.command()
@click.option(
    "--project",
    "-p",
    default=DEFAULT_PROJECT,
    help="Proyect you want to work with. It's a Toggl Project ID or name",
    type=click.UNPROCESSED,
)
@click.argument("description", required=False, default=DEFAULT_TIME_ENTRY)
def start(description, project):
    """Start a new time entry.
    """
    try:
        start_time_entry = StartTimeEntryUseCase(toggl_repository=toggl_repository)
        start_time_entry.exec(description, project)
        click.echo(f"Starting with '{description}'")
    except Exception as e:
        click.echo(e)
        click.echo("Error creating entry time.")


@click.command()
def stop():
    """Stop running time entry.
    """
    current_entry = toggl.get_current_entry()
    if current_entry:
        toggl.update_entry(
            id=current_entry["id"],
            wid=current_entry["wid"],
            stop=helpers.get_current_utc_date(),
        )
        click.echo(f"Time entry '{current_entry['description']}' stopped")
    else:
        click.echo("There is no time entry running.")


@click.command()
def current():
    """Show the current time entry.
    """
    current_entry = toggl.get_current_entry()
    if current_entry:
        duration = int(time.time()) + current_entry['duration']
        project = toggl.get_project_by_id(WORKSPACE_ID, current_entry['pid'])
        click.echo(helpers.render_time_entry({**current_entry, "duration": duration}, project))
    else:
        click.echo("There is no time entry running.")


@click.command()
def today():
    """Show the total time tracked today.
    """
    entries = toggl.get_today_entries()
    duration = helpers.sum_durations(entries)
    projects = toggl.get_projects(WORKSPACE_ID)
    click.echo(helpers.seconds_to_hms_string(duration))
    for entry in entries:
        project = helpers.get_project_by_id(entry['pid'], projects)
        print(f"  - {helpers.render_time_entry(entry, project)}")


@click.command()
def week():
    """Show the total time tracked this week.
    """
    entries = toggl.get_current_week_entries()
    duration = helpers.sum_durations(entries)
    click.echo(helpers.seconds_to_hms_string(duration))


@click.command()
def projects():
    """List projects its Toggl IDs
    """
    projects = toggl.get_projects(WORKSPACE_ID)
    for project in projects:
        print(f"  - {project['name']} ({project['id']})")


cli.add_command(restart)
cli.add_command(start)
cli.add_command(stop)
cli.add_command(today)
cli.add_command(week)
cli.add_command(projects)
cli.add_command(current)

if __name__ == "__main__":
    cli()
