import {Duration} from "./duration";
import {Project} from "./project";

export interface TimeEntryParams {
  description: string,
  duration?: Duration,
  id?: number,
  project: Project,
}

export class TimeEntry {
  description: string;
  duration: Duration;
  id: number;
  project: Project;

  constructor({ description, duration, id, project}: TimeEntryParams) {
    this.id = id || Math.floor(Math.random() * 10**16);
    this.project = project;
    this.description = description;
    this.duration = duration || new Duration();
  }

  toString(): string {
    return `${this.duration} - ${this.description} (${this.project.name})`;
  }
}
