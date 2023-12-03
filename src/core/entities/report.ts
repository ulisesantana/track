import {Duration} from "./duration";
import {TimeEntryList} from "./time-entry-list";

export class Report {
    readonly totalDuration: Duration

    constructor(readonly entries: TimeEntryList) {
        this.totalDuration = entries.getTotalDuration()
    }

    toString() {
        const report = this.totalDuration.toString()
        return [report, ...this.entries.values.map(entry => `  - ${entry}` )].join('\n')
    }
}
