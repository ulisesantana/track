import {Configuration} from "../../core";

export interface ConfigurationRepository {
    getAll(): Configuration

    setApiToken(key: string): void

    setDefaultProjectId(projectId: number): void

    setDefaultTimeEntry(timeEntryDescription: string): void

    setDefaultWorkspaceId(workspaceId: number): void
}
