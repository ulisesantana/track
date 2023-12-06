import {Duration, TimeEntry, TimeEntryParams} from "../../src/core";
import {buildProject} from "./project.builder";

type TimeEntryBuilderParams = Partial<Omit<TimeEntryParams, 'duration'> & {
    duration: number
}>
export function buildTimeEntry({description, duration, id, project}: TimeEntryBuilderParams = {}) {
    return new TimeEntry({
        description: description ?? 'Test entry',
        duration: new Duration(duration ?? 1800),
        id: id ?? Math.floor(Math.random() * 10 ** 16),
        project: project ?? buildProject(),
    })
}
