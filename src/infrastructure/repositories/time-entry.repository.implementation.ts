/* eslint-disable camelcase */
import {TimeEntryRepository} from "../../application/repositories";
import {Duration, NullProject, Nullable, Project, TimeEntry, TimeEntryList, TimeHelper} from '../../core';
import {TogglDataSource} from "../data-sources";
import {TogglProject, TogglTimeEntry} from "../types";

export class TimeEntryRepositoryImplementation implements TimeEntryRepository {
    constructor(private readonly api: TogglDataSource, private readonly time = new TimeHelper()) {
    }

    private static mapToTimeEntry(entry: TogglTimeEntry, project: Nullable<Project>): TimeEntry {
        return new TimeEntry({
            description: entry.description,
            duration: new Duration(entry.duration),
            id: entry.id,
            project: project ? new Project(project.id, project.name) : new NullProject(),
            wid: entry.workspace_id!
        })
    }

    private static mapToTimeEntryList(entries: Array<TogglTimeEntry>, projects: Array<TogglProject>) {
        const projectsId = new Set(entries.map(({project_id}) => project_id))
        const projectDictionary = projects.reduce(
            (dict, project) => projectsId.has(project.id)
                ? {
                    ...dict,
                    [project.id]: project
                }
                : dict,
            {} as Record<number, TogglProject>
        )

        return new TimeEntryList(
            entries.map(entry =>
                TimeEntryRepositoryImplementation.mapToTimeEntry(
                    entry,
                    projectDictionary[entry.project_id]
                )
            )
        )
    }

    private static mapToTogglTimeEntry(entry: TimeEntry): TogglTimeEntry {
        return {
            description: entry.description,
            duration: entry.duration.value,
            id: entry.id,
            project_id: entry.project.id,
        }
    }

    async createEntry(entry: TimeEntry, start: Date): Promise<TimeEntry> {
        const togglEntry = TimeEntryRepositoryImplementation.mapToTogglTimeEntry(entry)
        const newTimeEntry = await this.api.createTimeEntry(togglEntry, start)

        return TimeEntryRepositoryImplementation.mapToTimeEntry(newTimeEntry, entry.project)
    }

    async getCurrentEntry(): Promise<Nullable<TimeEntry>> {
        const [entry] = await this.api.getTimeEntries()
        const project = await this.api.getProjectById(entry.project_id)
        return TimeEntryRepositoryImplementation.mapToTimeEntry(entry, project)
    }

    async getCurrentWeekEntries(): Promise<TimeEntryList> {
        const [start, end] = this.time.getWeekDates(new Date())
        const [entries, projects] = await Promise.all([
            this.api.getTimeEntries(start, end),
            this.api.getProjects()
        ])

        return TimeEntryRepositoryImplementation.mapToTimeEntryList(entries, projects)
    }

    async getLastEntry(): Promise<Nullable<TimeEntry>> {
        const [entry] = await this.api.getTimeEntries()
        if (!entry) {
            return null
        }

        const project = await this.api.getProjectById(entry.project_id)
        return TimeEntryRepositoryImplementation.mapToTimeEntry(entry, project)
    }

    async getTodayEntries(): Promise<TimeEntryList> {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const entries = await this.api.getTimeEntries(today)
        if (entries.length === 0) {
            return new TimeEntryList([])
        }

        const projects = await this.api.getProjects()
        return TimeEntryRepositoryImplementation.mapToTimeEntryList(entries, projects)
    }

    async stopEntry(id: number, stopTime: Date): Promise<Nullable<TimeEntry>> {
        const entry = await this.api.updateTimeEntry(id, {stop: stopTime.toISOString()})
        if (!entry) {
            return null
        }

        const project = await this.api.getProjectById(entry.id)
        return TimeEntryRepositoryImplementation.mapToTimeEntry(entry, project)
    }
}