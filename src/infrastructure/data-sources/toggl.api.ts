/* eslint-disable camelcase */
import {Axios, AxiosResponse} from "axios";

import {Nullable} from "../../core";
import {TogglProject, TogglTimeEntry} from "../types";

export interface TogglApiParams {
    axios: Axios
    token: string
    workspaceId: number
}

export class TogglApi {
    static baseUrl = "https://api.track.toggl.com"
    private readonly axios: Axios
    private readonly basicHeaders: Record<string, string>
    private readonly workspaceId: number

    constructor({axios, token, workspaceId}: TogglApiParams) {
        this.axios = axios
        this.workspaceId = workspaceId
        this.basicHeaders = {
            "Authorization": `Basic ${Buffer.from(token.includes(':') ? token : `${token}:api_token`).toString('base64')}`,
            "content-type": "application/json",
        }
    }

    private static formatDate(date: Date): string {
        return date.toISOString().split('T').at(0)!
    }

    private static validateResponse(response: AxiosResponse): never | void {
        if (response.status >= 400) {
            throw new Error(response.statusText)
        }
    }

    async createTimeEntry(entry: TogglTimeEntry, start: Date): Promise<TogglTimeEntry> {
        const url = `${TogglApi.baseUrl}/api/v9/workspaces/${this.workspaceId}/time_entries`
        const body = {
            ...entry,
            created_with: "track CLI",
            duration: -1,
            start: start.toISOString(),
            workspace_id: this.workspaceId
        };
        const response = await this.axios.post<TogglTimeEntry>(url, body, {
            headers: this.basicHeaders,
        })

        TogglApi.validateResponse(response)

        return response.data
    }

    async getCurrentEntry(): Promise<Nullable<TogglTimeEntry>> {
        const url = `${TogglApi.baseUrl}/api/v9/me/time_entries/current`
        const response = await this.axios.get(url, {
            headers: this.basicHeaders
        })

        TogglApi.validateResponse(response)

        return response.data
    }

    async getProjectById(id: number): Promise<Nullable<TogglProject>> {
        const url = `${TogglApi.baseUrl}/api/v9/workspaces/${this.workspaceId}/projects/${id}`
        const response = await this.axios.get(url, {
            headers: this.basicHeaders
        })

        TogglApi.validateResponse(response)

        const project = response.data
        return typeof project === "string" ? null : project as TogglProject
    }

    async getProjects(): Promise<Array<TogglProject>> {
        const queryString = new URLSearchParams({active: "true"})
        const url = `${TogglApi.baseUrl}/api/v9/workspaces/${this.workspaceId}/projects?${queryString}`
        const response = await this.axios.get(url, {
            headers: this.basicHeaders,
        })

        TogglApi.validateResponse(response)

        return response.data
    }

    async getTimeEntries(from?: Date, to?: Date): Promise<Array<TogglTimeEntry>> {
        const queryString = new URLSearchParams()
        if (from && !to) {
            queryString.set('start_date', TogglApi.formatDate(from))
            queryString.set('end_date', TogglApi.formatDate(new Date()))
        }

        if (!from && to) {
            queryString.set('start_date', TogglApi.formatDate(new Date(0)))
            queryString.set('end_date', TogglApi.formatDate(to))
        }

        if (from && to) {
            queryString.set('start_date', TogglApi.formatDate(from))
            queryString.set('end_date', TogglApi.formatDate(to))
        }

        const url = [...queryString.entries()].length > 0
            ? `${TogglApi.baseUrl}/api/v9/me/time_entries`
            : `${TogglApi.baseUrl}/api/v9/me/time_entries?${queryString}`
        const response = await this.axios.get(url, {
            headers: this.basicHeaders,
        })

        TogglApi.validateResponse(response)

        return response.data
    }

    async updateTimeEntry(id: number, update: Partial<TogglTimeEntry>): Promise<TogglTimeEntry> {
        const url = `${TogglApi.baseUrl}/api/v9/workspaces/${this.workspaceId}/time_entries/${id}`
        const response = await this.axios.put(url, update, {
            headers: this.basicHeaders,
        })

        TogglApi.validateResponse(response)

        return response.data
    }
}

