oclif-hello-world
=================

oclif example Hello World CLI

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
$ track COMMAND
running command...
$ track (--version)
track/0.0.0 darwin-arm64 node-v20.2.0
$ track --help [COMMAND]
USAGE
  $ track COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`track hello PERSON`](#track-hello-person)
* [`track hello world`](#track-hello-world)
* [`track help [COMMANDS]`](#track-help-commands)
* [`track plugins`](#track-plugins)
* [`track plugins:install PLUGIN...`](#track-pluginsinstall-plugin)
* [`track plugins:inspect PLUGIN...`](#track-pluginsinspect-plugin)
* [`track plugins:install PLUGIN...`](#track-pluginsinstall-plugin-1)
* [`track plugins:link PLUGIN`](#track-pluginslink-plugin)
* [`track plugins:uninstall PLUGIN...`](#track-pluginsuninstall-plugin)
* [`track plugins reset`](#track-plugins-reset)
* [`track plugins:uninstall PLUGIN...`](#track-pluginsuninstall-plugin-1)
* [`track plugins:uninstall PLUGIN...`](#track-pluginsuninstall-plugin-2)
* [`track plugins update`](#track-plugins-update)

## `track hello PERSON`

Say hello

```
USAGE
  $ track hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/ulisesantana/track/blob/v0.0.0/src/commands/hello/index.ts)_

## `track hello world`

Say hello world

```
USAGE
  $ track hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ track hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/ulisesantana/track/blob/v0.0.0/src/commands/hello/world.ts)_

## `track help [COMMANDS]`

Display help for track.

```
USAGE
  $ track help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for track.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `track plugins`

List installed plugins.

```
USAGE
  $ track plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ track plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/index.ts)_

## `track plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ track plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ track plugins add

EXAMPLES
  $ track plugins add myplugin 

  $ track plugins add https://github.com/someuser/someplugin

  $ track plugins add someuser/someplugin
```

## `track plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ track plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ track plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/inspect.ts)_

## `track plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ track plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ track plugins add

EXAMPLES
  $ track plugins install myplugin 

  $ track plugins install https://github.com/someuser/someplugin

  $ track plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/install.ts)_

## `track plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ track plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help      Show CLI help.
  -v, --verbose
  --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ track plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/link.ts)_

## `track plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ track plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ track plugins unlink
  $ track plugins remove

EXAMPLES
  $ track plugins remove myplugin
```

## `track plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ track plugins reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/reset.ts)_

## `track plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ track plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ track plugins unlink
  $ track plugins remove

EXAMPLES
  $ track plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/uninstall.ts)_

## `track plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ track plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ track plugins unlink
  $ track plugins remove

EXAMPLES
  $ track plugins unlink myplugin
```

## `track plugins update`

Update installed plugins.

```
USAGE
  $ track plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/update.ts)_
<!-- commandsstop -->
