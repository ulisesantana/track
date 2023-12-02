import {Duration} from "./duration";
import {Project} from "./project";
import {ReportEntry} from "./report-entry";
import {TimeEntryList} from "./time-entry-list";

export class Report {
    readonly entries: ReportEntry[]
    readonly totalDuration: Duration

    constructor(entries: TimeEntryList, projects: Record<string, Project>) {
        this.totalDuration = entries.getTotalDuration()
        this.entries = Object.values(entries.groupEntriesByDescription())
            .map(entry => new ReportEntry(entry, projects[entry.pid]))
    }

    toString() {
        const report = this.totalDuration.toString()
        return [report, ...this.entries.map(entry => `  - ${entry}` )].join('\n')
    }
}
