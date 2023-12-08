import {ConfigurationRepository} from "../../application/repositories";
import {Configuration} from "../../core";
import {FileDb} from "../data-sources";

export class ConfigurationRepositoryImplementation implements ConfigurationRepository {
    constructor(private readonly source: FileDb<Configuration>) {}

    async getAll(): Promise<Configuration> {
        const [
            apiToken,
                defaultTimeEntry,
            projectId,
            workspaceId
        ] = await Promise.all([
            this.source.get('apiToken') as Promise<string>,
            this.source.get('defaultTimeEntry') as Promise<string>,
            this.source.get('projectId') as Promise<number>,
            this.source.get('workspaceId') as Promise<number>
        ])
        return {
            apiToken,
            defaultTimeEntry,
            projectId,
            workspaceId
        }
    }

    setApiToken(key: string): Promise<void> {
        return this.source.set('apiToken', key)
    }

    setDefaultProjectId(projectId: number): Promise<void> {
        return this.source.set('projectId', projectId)
    }

    setDefaultTimeEntry(timeEntryDescription: string): Promise<void> {
        return this.source.set('defaultTimeEntry', timeEntryDescription)
    }

    setDefaultWorkspaceId(workspaceId: number):Promise <void> {
        return this.source.set('workspaceId', workspaceId)
    }
}
