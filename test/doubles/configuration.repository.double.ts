/* eslint-disable @typescript-eslint/no-unused-vars */
import {ConfigurationRepository} from "../../src/application/repositories";
import {Configuration, defaultConfiguration} from "../../src/core";

export class ConfigurationRepositoryDouble implements ConfigurationRepository {
    getAll(): Configuration {
        return defaultConfiguration;
    }

    setApiToken(key: string): void {
    }

    setDefaultProjectId(projectId: number): void {
    }

    setDefaultTimeEntry(timeEntryDescription: string): void {
    }

    setDefaultWorkspaceId(workspaceId: number): void {
    }


}
