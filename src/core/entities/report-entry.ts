import {Project} from "./project";
import {TimeEntry} from "./time-entry";

export class ReportEntry {
    constructor(
        private readonly entry: TimeEntry,
        private readonly project: Project = new Project(entry.pid, "Unknown project")
    ) {}

    toString() {
        return `${this.entry} (${this.project.name})`
    }
}
