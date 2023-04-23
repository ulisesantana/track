# track - A Toggl Track personal CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![codecov](https://codecov.io/gh/ulisesantana/track/graph/badge.svg?token=TlQWNm7TqJ)](https://codecov.io/gh/ulisesantana/track)
[![tests](https://github.com/ulisesantana/track/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/ulisesantana/track/actions/workflows/test.yml)
[![GitHub license](https://img.shields.io/github/license/ulisesantana/track)](https://github.com/ulisesantana/track/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g track
$ track help
A CLI for Toggl Track

USAGE
  $ track [COMMAND]

TOPICS
  set  Set your config individually.

COMMANDS
  autocomplete  Display autocomplete installation instructions.
  config        Get your config for track.
  continue      Continue with last time entry.
  current       Show running time entry.
  help          Display help for track.
  setup         Setup your config for track.
  start         Start a new time entry.
  stop          Stop running time entry.
  today         Show time entries run today.
  week          Show time entries run current week.
  yesterday     Show time entries run yesterday.
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`track config`](#track-config)
* [`track continue`](#track-continue)
* [`track current`](#track-current)
* [`track set description`](#track-set-description)
* [`track set project`](#track-set-project)
* [`track set token`](#track-set-token)
* [`track set workspace`](#track-set-workspace)
* [`track setup`](#track-setup)
* [`track start`](#track-start)
* [`track stop`](#track-stop)
* [`track today`](#track-today)
* [`track week`](#track-week)
* [`track yesterday`](#track-yesterday)

## `track config`

Show your current config

```
Get your config for track CLI.

USAGE
  $ track config

DESCRIPTION
  Get your config for track CLI.

EXAMPLES
  $ track config
```

_See code: [src/commands/config.ts](https://github.com/ulisesantana/track/blob/v0.0.0/src/commands/config.ts)_

## `track continue`

Continue with last time entry.
 
_See code: [src/commands/current/current.ts]_

## `track current`
Description

Usage 

See code 

## `track set description`
Description

Usage 

See code 

## `track set project`
Description

Usage 

See code 

## `track set token`
Description

Usage 

See code 

## `track set workspace`
Description

Usage 

See code 

## `track setup`
Description

Usage 

See code 

## `track start`
Description

Usage 

See code 

## `track stop`
Description

Usage 

See code 

## `track today`
Description

Usage 

See code 

## `track week`
Description

Usage 

See code 

## `track yesterday`
Description

Usage 

See code 

<!-- commandsstop -->

## How to use
```shell
Usage: track [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  continue  Continue with the last time entry.
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
