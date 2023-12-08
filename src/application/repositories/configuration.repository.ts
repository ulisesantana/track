import {Configuration} from "../../core";

export interface ConfigurationRepository {
    getAll(): Promise<Configuration>

    setApiToken(key: string): Promise<void>

    setDefaultProjectId(projectId: number): Promise<void>

    setDefaultTimeEntry(timeEntryDescription: string): Promise<void>

    setDefaultWorkspaceId(workspaceId: number): Promise<void>
}
