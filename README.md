# track - A toggl Track personal CLI

```shell
Usage: track [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  continue  Continue with the last time entry.
  current   Show the current time entry.
  start     Start a new time entry.
  stop      Stop running time entry.
  today     Show the total time tracked today.
  week      Show the total time tracked this week.
```

## Install
Add to your .zshenv:
```env
export TOGGL_API_TOKEN="email:password"
export TOGGL_WORKSPACE_ID=1234567890
export TOGGL_DEFAULT_TIME_ENTRY="Doing stuff"
export TOGGL_DEFAULT_PROJECT=1234567890
```

Install in your shell (requires Python >= 3.9.6):
```shell
poetry build
pip install dist/track-0.1.0.tar.gz
```
