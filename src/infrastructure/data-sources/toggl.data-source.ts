import {Nullable} from "../../core";
import {FetchFunction, TogglProject, TogglTimeEntry} from "../types";

export interface TogglDataSourceParams {
    baseUrl?: string
    fetch: FetchFunction
    token: string
    workspaceId: number
}

export class TogglDataSource {
    private readonly baseUrl: string
    private readonly basicHeaders: Headers
    private readonly fetch: FetchFunction
    private readonly workspaceId: number

    constructor({baseUrl, fetch, token, workspaceId}: TogglDataSourceParams) {
        this.fetch = fetch
        this.baseUrl = baseUrl || "https://api.track.toggl.com/api/v9"
        this.workspaceId = workspaceId
        this.basicHeaders = new Headers({
            "Authorization": `Basic ${Buffer.from(token).toString('base64')}`,
            "content-type": "application/json",
        })
    }

    private static formatDate(date: Date): string {
        return date.toISOString().split('T').at(0)!
    }

    async createTimeEntry(entry: TogglTimeEntry, start: Date): Promise<TogglTimeEntry> {
        const url = `${this.baseUrl}/workspaces/${this.workspaceId}/time_entries`
        const response = await this.fetch(url, {
            body: JSON.stringify({...entry, start: start.toISOString()}),
            headers: this.basicHeaders,
            method: "POST",
        })
        return await response.json() as TogglTimeEntry
    }

    async getCurrentEntry(): Promise<Nullable<TogglTimeEntry>> {
        const url = `${this.baseUrl}/me/time_entries/current`
        const response = await this.fetch(url, {
            headers: this.basicHeaders,
            method: "GET",
        })
        return await response.json() as Nullable<TogglTimeEntry>
    }

    async getProjectById(id: number): Promise<Nullable<TogglProject>> {
        const url = `${this.baseUrl}/workspaces/${this.workspaceId}/projects/${id}`
        const response = await this.fetch(url, {
            headers: this.basicHeaders,
            method: "GET",
        })
        const project = await response.json()
        return typeof project === "string" ? null : project as TogglProject
    }

    async getProjects(): Promise<Array<TogglProject>> {
        const queryString = new URLSearchParams({active: "true"})
        const url = `${this.baseUrl}/workspaces/${this.workspaceId}/projects?${queryString}`
        const response = await this.fetch(url, {
            headers: this.basicHeaders,
            method: "GET",
        })
        return await response.json() as Array<TogglProject>
    }

    async getTimeEntries(from?: Date, to?: Date): Promise<Array<TogglTimeEntry>> {
        const queryString = new URLSearchParams()
        if (from && !to) {
            queryString.set('start_date', TogglDataSource.formatDate(from))
            queryString.set('end_date', TogglDataSource.formatDate(new Date()))
        }

        if (!from && to) {
            queryString.set('start_date', TogglDataSource.formatDate(new Date(0)))
            queryString.set('end_date', TogglDataSource.formatDate(to))
        }

        if (from && to) {
            queryString.set('start_date', TogglDataSource.formatDate(from))
            queryString.set('end_date', TogglDataSource.formatDate(to))
        }

        const url = [...queryString.entries()].length > 0
            ? `${this.baseUrl}/me/time_entries`
            : `${this.baseUrl}/me/time_entries?${queryString}`
        const response = await this.fetch(url, {
            headers: this.basicHeaders,
            method: "GET",
        })
        return await response.json() as Array<TogglTimeEntry>
    }

    async updateTimeEntry(id: number, update: Partial<TogglTimeEntry>): Promise<TogglTimeEntry> {
        const url = `${this.baseUrl}/workspaces/${this.workspaceId}/time_entries/${id}`
        const response = await this.fetch(url, {
            body: JSON.stringify({...update}),
            headers: this.basicHeaders,
            method: "PUT",
        })
        return await response.json() as TogglTimeEntry
    }
}

