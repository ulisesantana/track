import {Duration, TimeEntry, TimeEntryParams} from "../../src/core";

type TimeEntryBuilderParams = Partial<Omit<TimeEntryParams, 'duration'> & {
    duration: number
}>
export function buildTimeEntry({description, duration, id, pid, wid}: TimeEntryBuilderParams) {
    return new TimeEntry({
        description: description ?? 'Test entry',
        duration: new Duration(duration ?? 1800),
        id: id ?? Math.floor(Math.random() * 10 ** 16),
        pid: pid ?? 1,
        wid: wid ?? 1
    })
}
