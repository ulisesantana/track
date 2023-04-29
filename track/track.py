import click

from track.infrastructure import Config
from track.infrastructure.cli import TrackCLI
from track.infrastructure.repositories import TogglRepository

toggl_repository = TogglRepository(workspace_id=Config.get_workspace_id(), token=Config.get_token())
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
    default=Config.get_default_project(),
    help="Project you want to work with. It's a Toggl Project ID or name",
    type=click.UNPROCESSED,
)
@click.argument("description", required=False, default=Config.get_default_time_entry())
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
