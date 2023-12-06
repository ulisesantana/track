import {ConfigurationRepository} from "../../application/repositories";
import {Configuration} from "../../core";
import {FileDb} from "../data-sources";

export class ConfigurationRepositoryImplementation implements ConfigurationRepository {
    constructor(private readonly source: FileDb<Configuration>) {}

    getAll(): Configuration {
        return {
            apiToken: this.source.get('apiToken') as string,
            defaultTimeEntry: this.source.get('defaultTimeEntry') as string,
            projectId: this.source.get('projectId') as number,
            workspaceId: this.source.get('workspaceId') as number
        }
    }

    setApiToken(key: string): void {
        this.source.set('apiToken', key)
    }

    setDefaultProjectId(projectId: number): void {
        this.source.set('projectId', projectId)
    }

    setDefaultTimeEntry(timeEntryDescription: string): void {
        this.source.set('defaultTimeEntry', timeEntryDescription)
    }

    setDefaultWorkspaceId(workspaceId: number): void {
        this.source.set('workspaceId', workspaceId)
    }
}
