import os

import click

from track import helpers, toggl
from track.cases import ContinueWithLastTimeEntryUseCase, GetCurrentTimeEntryUseCase, \
    StartTimeEntryUseCase, StopTimeEntryUseCase
from track.repositories.toggl_repository import TogglRepository

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
    case = ContinueWithLastTimeEntryUseCase(toggl_repository)
    last_entry = case.exec()
    if last_entry:
        description = last_entry["description"]
        click.echo(f"Continuing with '{description}'")
    else:
        click.echo("Error creating time entry.")


@click.command()
@click.option(
    "--project",
    "-p",
    default=DEFAULT_PROJECT,
    help="Project you want to work with. It's a Toggl Project ID or name",
    type=click.UNPROCESSED,
)
@click.argument("description", required=False, default=DEFAULT_TIME_ENTRY)
def start(description, project):
    """Start a new time entry.
    """
    try:
        case = StartTimeEntryUseCase(toggl_repository)
        case.exec(description, project)
        click.echo(f"Starting with '{description}'")
    except Exception as e:
        click.echo(e)
        click.echo("Error creating entry time.")


@click.command()
def stop():
    """Stop running time entry.
    """
    case = StopTimeEntryUseCase(toggl_repository)
    stopped_time_entry = case.exec()
    if stopped_time_entry:
        click.echo(f"Time entry '{stopped_time_entry['description']}' stopped")
    else:
        click.echo("There is no time entry running.")


@click.command()
def current():
    """Show the current time entry.
    """
    case = GetCurrentTimeEntryUseCase(toggl_repository)
    current_entry, project = case.exec()
    if current_entry:
        click.echo(helpers.render_time_entry(current_entry, project))
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
