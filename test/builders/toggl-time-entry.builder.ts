/* eslint-disable camelcase */
import {TogglTimeEntry} from "../../src/infrastructure/types";

export function buildTogglTimeEntry(params = {} as Partial<TogglTimeEntry>): TogglTimeEntry {
    return {
        description: params.description ?? "Dummy time entry",
        duration: params.duration ?? 1800,
        id: params.id ?? Math.floor(Math.random() * 10**16),
        project_id: params.project_id ?? Math.floor(Math.random() * 10**16)
    }
}
