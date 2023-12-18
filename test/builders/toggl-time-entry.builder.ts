/* eslint-disable camelcase */
import {TogglTimeEntry} from "../../src/infrastructure/types";

export function buildTogglTimeEntry(params = {} as Partial<TogglTimeEntry>): TogglTimeEntry {
    const duration = params.duration ?? 1800
    const start = new Date(Date.now() - (duration * 1000))
    const stop = new Date()
    return {
        description: params.description ?? "Dummy time entry",
        duration,
        id: params.id ?? Math.floor(Math.random() * 10**16),
        project_id: params.project_id ?? Math.floor(Math.random() * 10**16),
        start: params.start ?? start.toISOString(),
        stop: params.stop ?? stop.toISOString()
    }
}
