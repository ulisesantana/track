import {TogglProject} from "../../src/infrastructure/types";

export function buildTogglProject(params: Partial<TogglProject> = {}): TogglProject {
    return {
        id: params.id ?? 1,
        name: params.name ?? "Dummy Project",
        // eslint-disable-next-line camelcase
        workspace_id: params.workspace_id ?? 1
    }
}
