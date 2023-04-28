import os

import click

from track.infrastructure.cli import TrackCLI
from track.infrastructure.repositories import TogglRepository

WORKSPACE_ID = int(os.environ.get('TOGGL_WORKSPACE_ID'))
DEFAULT_PROJECT = int(os.environ.get('TOGGL_DEFAULT_PROJECT'))
DEFAULT_TIME_ENTRY = os.environ.get('TOGGL_DEFAULT_TIME_ENTRY')
TOKEN = os.environ.get('TOGGL_API_TOKEN')
toggl_repository = TogglRepository(workspace_id=WORKSPACE_ID, token=TOKEN)
track_cli = TrackCLI(time_entry_repository=toggl_repository, print=click.echo)


@click.group()
def cli():
    pass


@click.command(name="continue")
def restart():
    """Continue with the last time entry.
    """
    track_cli.restart()


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
    track_cli.start(description, project)


@click.command()
def stop():
    """Stop running time entry.
    """
    track_cli.stop()


@click.command()
def current():
    """Show the current time entry.
    """
    track_cli.current()


@click.command()
def today():
    """Show the total time tracked today.
    """
    track_cli.today()


@click.command()
def week():
    """Show the total time tracked this week.
    """
    track_cli.week()


cli.add_command(restart)
cli.add_command(start)
cli.add_command(stop)
cli.add_command(today)
cli.add_command(week)
cli.add_command(current)

if __name__ == "__main__":
    cli()
