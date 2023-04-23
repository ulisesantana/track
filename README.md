# track - A toggl Track personal CLI

## How to use
```shell
Usage: track [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  continue
  start
  stop
  today
  week
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
