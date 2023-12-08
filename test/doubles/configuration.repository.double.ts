/* eslint-disable @typescript-eslint/no-unused-vars */
import {ConfigurationRepository} from "../../src/application/repositories";
import {Configuration} from "../../src/core";
import {configuration} from "../fixtures";

export class ConfigurationRepositoryDouble implements ConfigurationRepository {
    async getAll(): Promise<Configuration> {
        return configuration;
    }

    async setApiToken(key: string): Promise<void> {
    }

    async setDefaultProjectId(projectId: number): Promise<void> {
    }

    async setDefaultTimeEntry(timeEntryDescription: string): Promise<void> {
    }

    async setDefaultWorkspaceId(workspaceId: number): Promise<void> {
    }


}
