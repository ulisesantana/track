import {ConfigurationRepository} from "../../application/repositories";
import {Configuration} from "../../core";
import {ConfigDataSource} from "../data-sources";

export class ConfigurationRepositoryImplementation implements ConfigurationRepository {
    constructor(private readonly source: ConfigDataSource) {}

    getAll(): Configuration {
        return {
            apiKey: this.source.get('apiKey') as string,
            defaultTimeEntry: this.source.get('defaultTimeEntry') as string,
            projectId: this.source.get('projectId') as number,
            workspaceId: this.source.get('workspaceId') as number
        }
    }

    setApiKey(key: string): void {
        this.source.set('apiKey', key)
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
