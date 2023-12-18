/* eslint-disable camelcase */
import {input, select} from '@inquirer/prompts';
import {Command} from '@oclif/core'
import path from "node:path";

import {configFilename} from "../core";
import {FileSystemDataSource, TogglApi, UserInfo, http} from "../infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../infrastructure/repositories";

export default class Setup extends Command {
    static description = 'Setup your config for track CLI.'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    private static sortByName = (a: { name: string }, b: { name: string }) =>
        a.name > b.name
            ? 1
            : a.name < b.name
                ? -1
                : 0

    static async setApiKey(configurationRepository: ConfigurationRepositoryImplementation) {
        const apiKey = await input({message: 'Enter your name API Key:\n(For getting your Toggl API token you can go to https://track.toggl.com/profile and scroll to the bottom of your profile)\n'});
        await configurationRepository.setApiToken(apiKey)
        return apiKey;
    }

    static async setDefaultProject({clients, projects}: UserInfo, configurationRepository: ConfigurationRepositoryImplementation) {
        const clientMap = new Map(clients.map(client => [client.id, client]))
        const choices = projects
            .filter(({active}) => active)
            .sort(Setup.sortByName)
            .map(project => ({
                name: `${project.name} (${clientMap.get(project.client_id)?.name || 'No client'})`,
                value: project.id
            }))
        const defaultProjectId = await select({
            choices,
            message: 'Select your default project',
        });
        await configurationRepository.setDefaultProjectId(defaultProjectId)
        return choices.find(({value}) => value === defaultProjectId)?.name
    }

    static async setDefaultTimeEntryDescription(configurationRepository: ConfigurationRepositoryImplementation) {
        const defaultTimeEntry = await input({
            default: 'Working',
            message: 'Enter your default time entry description.',
            validate: Boolean
        });
        await configurationRepository.setDefaultTimeEntry(defaultTimeEntry)
        return defaultTimeEntry
    }

    static async setDefaultWorkspace({default_workspace_id, workspaces}: UserInfo, configurationRepository: ConfigurationRepositoryImplementation) {
        workspaces.sort(Setup.sortByName)
        const defaultWorkspace = workspaces.find(({id}) => id === default_workspace_id)!
        const choices = [defaultWorkspace, ...workspaces.filter(({id}) => id !== default_workspace_id)].map(workspace => ({
            name: workspace.name,
            value: workspace.id
        }))
        const defaultWorkspaceId = await select({
            choices,
            message: 'Select your default workspace',
        });
        await configurationRepository.setDefaultWorkspaceId(defaultWorkspaceId)
        return choices.find(({value}) => value === defaultWorkspaceId)?.name
    }

    public async run(): Promise<void> {
        const configurationRepository = new ConfigurationRepositoryImplementation(new FileSystemDataSource(path.join(this.config.configDir, configFilename)))
        try {
            // Add your API Key
            const apiKey = await Setup.setApiKey(configurationRepository);
            // Get user info
            const userInfo = await TogglApi.getUserInfo(apiKey, http)
            // Select your default workspace
            await Setup.setDefaultWorkspace(userInfo, configurationRepository);
            // Select your default project
            await Setup.setDefaultProject(userInfo, configurationRepository);
            // Add your default time entry description
            await Setup.setDefaultTimeEntryDescription(configurationRepository);
            this.log('Your config for track CLI has been setup.')
        } catch (error) {
            this.log(`There was an error trying to setting up your config. Detailed error:`)
            this.log(`${error}`)
        }
    }
}
