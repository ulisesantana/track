import {Command, Flags} from '@oclif/core'
import createConfigurationStore from "configuration-store";

import {
    SetApiTokenUseCase,
    SetDefaultProjectUseCase,
    SetDefaultTimeEntryDescriptionUseCase,
    SetDefaultWorkspaceIdUseCase
} from "../../application/cases";
import {ConfigurationRepository} from "../../application/repositories";
import {Configuration, configFilename} from "../../core";
import {ConfigurationRepositoryImplementation} from "../../infrastructure/repositories";

interface ConfigSetFlags {
    description: string,
    project: number,
    token: string,
    workspace: number
}

type ConfigSetFlagsValues = ConfigSetFlags[keyof ConfigSetFlags]

export default class ConfigSet extends Command {
    static configurationRepository: ConfigurationRepository = new ConfigurationRepositoryImplementation(createConfigurationStore<Configuration>({filename: configFilename}))
    static description = 'Set your configuration for track CLI'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static flags = {
        description: Flags.string({char: 'd', description: 'Set a default time entry description.'}),
        project: Flags.integer({char: 'p', description: 'Set a default project id for your time entries.'}),
        // At the bottom of https://track.toggl.com/profile
        token: Flags.string({char: 't', description: 'Set Toggl API token.'}),
        workspace: Flags.integer({char: 'w', description: 'Set a default workspace id for your time entries.'}),
    }

    private static async execUseCaseFor(flag: keyof ConfigSetFlags, value: ConfigSetFlagsValues): Promise<{
        error: boolean
        message: string,
    }> {
        try {
            if (flag === "project") {
                await new SetDefaultProjectUseCase(ConfigSet.configurationRepository).exec(value as number)
                return {error: false, message: `✅ Default project set to ${value}.`}
            }

            if (flag === "workspace") {
                await new SetDefaultWorkspaceIdUseCase(ConfigSet.configurationRepository).exec(value as number)
                return {error: false, message: `✅ Default workspace set to ${value}.`}
            }

            if (flag === "token") {
                await new SetApiTokenUseCase(ConfigSet.configurationRepository).exec(value as string)
                return {error: false, message: `✅ Toggl API token set to ${value}.`}
            }

            await new SetDefaultTimeEntryDescriptionUseCase(ConfigSet.configurationRepository).exec(value as string)
            return {error: false, message: `✅ Default time entry description set to "${value}".`}
        } catch {
            if (flag === "project") return {error: true, message: "⚠️ Error updating default project."}
            if (flag === "workspace") return {error: true, message: "⚠️ Error updating default workspace."}
            if (flag === "token") return {error: true, message: "⚠️ Error updating Toggl API token."}
            return {error: true, message: "⚠️ Error updating default time entry description."}
        }


    }

    public async run(): Promise<void> {
        const {flags} = await this.parse(ConfigSet)
        const flagEntries = Object.entries(flags)
        if (flagEntries.length === 0) {
            this.log('Missing properties to set. Check command help.')
            return
        }

        const updates = flagEntries.map(([k, v]) => ConfigSet.execUseCaseFor(k as keyof ConfigSetFlags, v))
        const messages = await Promise.all(updates)
        const success = messages.filter(({error}) => !error).map(({message}) => message).sort()
        const errors = messages.filter(({error}) => error).map(({message}) => message).sort()
        for (const message of [...success, ...errors]) {
            this.log(` - ${message}`)
        }
    }
}
