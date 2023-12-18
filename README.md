# track CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

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


Continue with last time entry.
 
 ```
USAGE
  $ track continue
_See code: [src/commands/current/current.ts]_

## `track help`

Display help for track.
 
 ```
USAGE
  $ track help
_See code: [src/commands/start/start.ts]_

<!-- commandsstop -->
