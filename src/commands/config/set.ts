import {Command, Flags} from '@oclif/core'
import path from "node:path";

import {
    SetApiTokenUseCase,
    SetDefaultProjectUseCase,
    SetDefaultTimeEntryDescriptionUseCase,
    SetDefaultWorkspaceIdUseCase
} from "../../application/cases";
import {ConfigurationRepository} from "../../application/repositories";
import {configFilename} from "../../core";
import {FileSystemDataSource} from "../../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../../infrastructure/repositories";

interface ConfigSetFlags {
    description: string,
    project: number,
    token: string,
    workspace: number
}

export default class ConfigSet extends Command {
    static description = 'Set your configuration for track CLI'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static flags = {
        description: Flags.string({char: 'd', description: 'Set a default time entry description.'}),
        project: Flags.integer({char: 'p', description: 'Set a default project id for your time entries.'}),
        token: Flags.string({char: 't', description: 'Set Toggl API token.'}),
        workspace: Flags.integer({char: 'w', description: 'Set a default workspace id for your time entries.'}),
    }

    // It's ugly as fuck, but you need to give some time to the file system to avoid race conditions
    private static async executeUseCases(flags: ConfigSetFlags, repository: ConfigurationRepository): Promise<{
        errors: string[]
        success: string[],
    }> {
        const success = []
        const errors = []
        if (flags.project) {
            try {
                await new SetDefaultProjectUseCase(repository).exec(flags.project as number)
                success.push(`✅ Default project set to ${flags.project}.`)
            } catch {
                errors.push("⚠️ Error updating default project.")
            }
        }

        if (flags.workspace) {
            try {
                await new SetDefaultWorkspaceIdUseCase(repository).exec(flags.workspace as number)
                success.push(`✅ Default workspace set to ${flags.workspace}.`)
            } catch {
                errors.push("⚠️ Error updating default workspace.")
            }
        }

        if (flags.token) {
            try {
                await new SetApiTokenUseCase(repository).exec(flags.token as string)
                success.push(`✅ Toggl API token set to ${flags.token}.`)
            } catch {
                errors.push("⚠️ Error updating Toggl API token.")
            }
        }

        if (flags.description) {
            try {
                await new SetDefaultTimeEntryDescriptionUseCase(repository).exec(flags.description as string)
                success.push(`✅ Default time entry description set to "${flags.description}".`)
            } catch {
                errors.push("⚠️ Error updating default time entry description.")
            }
        }

        return {errors, success}
    }

    public async run(): Promise<void> {
        const {flags} = await this.parse(ConfigSet)
        if (Object.entries(flags).length === 0) {
            this.log('Missing properties to set. Check command help.')
            return
        }

        const repository = new ConfigurationRepositoryImplementation(
            new FileSystemDataSource(path.join(this.config.configDir, configFilename))
        )
        const {errors, success} = await ConfigSet.executeUseCases(flags as ConfigSetFlags, repository)

        for (const message of [...success.sort(), ...errors.sort()]) {
            this.log(` - ${message}`)
        }
    }
}
