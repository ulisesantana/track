import {Duration} from "./duration";
import {Project} from "./project";

export interface TimeEntryParams {
  description: string,
  duration?: Duration,
  id?: number,
  project: Project,
  wid: number
}

export class TimeEntry {
  description: string;
  duration: Duration;
  id: number;
  project: Project;
  wid: number;

  constructor({ description, duration, id, project, wid}: TimeEntryParams) {
    this.id = id || Math.floor(Math.random() * 10**16);
    this.project = project;
    this.wid = wid;
    this.description = description;
    this.duration = duration || new Duration();
  }

  toString(): string {
    return `${this.duration} - ${this.description} (${this.project.name})`;
  }
}
