import {Duration} from "./duration";

export interface TimeEntryParams {
  description: string,
  duration?: Duration,
  id?: number,
  pid: number,
  wid: number
}

export class TimeEntry {
  description: string;
  duration: Duration;
  id: number;
  pid: number;
  wid: number;

  constructor({ description, duration, id, pid, wid}: TimeEntryParams) {
    this.id = id || Math.floor(Math.random() * 10**16);
    this.pid = pid;
    this.wid = wid;
    this.description = description;
    this.duration = duration || new Duration();
  }

  toString(): string {
    return `${this.duration} - ${this.description}`;
  }
}
