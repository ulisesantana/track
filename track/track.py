import click
from track import toggl, helpers
import os

WORKSPACE_ID = int(os.environ.get('TOGGL_WORKSPACE_ID'))
DEFAULT_PROJECT = int(os.environ.get('TOGGL_DEFAULT_PROJECT'))
DEFAULT_TIME_ENTRY = os.environ.get('TOGGL_DEFAULT_TIME_ENTRY')

@click.group()
def cli():
    pass

@click.command(name= "continue")
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
    help="Proyect you want to work with. It's a Toggl Project ID or name",
    type=click.UNPROCESSED,
)
@click.argument("description", required=False, default=DEFAULT_TIME_ENTRY)
def start(description, project):
    """Start a new time entry.
    """
    try:
        projectId = None
        if helpers.is_valid_toggl_id(project):
            projectId = project
        else:
            projects = toggl.get_projects(WORKSPACE_ID)
            projectId = helpers.get_project_id_by_name(project, projects)
        toggl.create_entry(
            wid=WORKSPACE_ID,
            description=description,
            pid=projectId,
            start=helpers.get_current_utc_date(),
        )
        click.echo(f"Starting with '{description}'")
    except:
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
def today():
    """Show the total time tracked today.
    """
    # Implementar la función para mostrar el tiempo trackeado hoy
    entries = toggl.get_today_entries()
    duration = helpers.sum_durations(entries)
    click.echo(helpers.seconds_to_hms_string(duration))


@click.command()
def week():
    """Show the total time tracked this week.
    """
    # Implementar la función para mostrar el tiempo trackeado hoy
    entries = toggl.get_current_week_entries()
    duration = helpers.sum_durations(entries)
    click.echo(helpers.seconds_to_hms_string(duration))

@click.command()
def projects():
    """List projects its Toggl IDs
    """
    # Implementar la función para mostrar el tiempo trackeado hoy
    projects = toggl.get_projects(WORKSPACE_ID)
    for project in projects:
        print(f"  - {project['name']} ({project['id']})")


cli.add_command(restart)
cli.add_command(start)
cli.add_command(stop)
cli.add_command(today)
cli.add_command(week)
cli.add_command(projects)

if __name__ == "__main__":
    cli()
