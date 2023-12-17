/* eslint-disable camelcase */
import {AxiosError, AxiosInstance} from "axios";

import {Nullable} from "../../core";
import {
    AuthorizationError,
    NotFoundError,
    RequestError,
    ServerError
} from "../errors";
import {TogglProject, TogglTimeEntry} from "../types";

export interface TogglApiParams {
    http: AxiosInstance
    token: string
    workspaceId: number
}

export class TogglApi {
    static baseUrl = "https://api.track.toggl.com"
    private readonly basicHeaders: Record<string, string>
    private readonly http: AxiosInstance
    private readonly workspaceId: number

    constructor({http, token, workspaceId}: TogglApiParams) {
        this.http = http
        this.workspaceId = workspaceId
        this.basicHeaders = {
            "Authorization": `Basic ${Buffer.from(token.includes(':') ? token : `${token}:api_token`).toString('base64')}`,
            "content-type": "application/json",
        }
    }

    private static formatDate(date: Date): string {
        return date.toISOString().split('T').at(0)!
    }

    private static handleError(error: AxiosError): never {
        if (error.response?.status === 403) throw new AuthorizationError()
        if (error.response?.status === 404) throw new NotFoundError()
        if (error.response?.status === 500) throw new ServerError()
        throw new RequestError(error.response?.status || -1, `${error.cause}`)
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

        try {
            const response = await this.http.post<TogglTimeEntry>(url, body, {
                headers: this.basicHeaders,
            })
            return response.data
        } catch (error) {
            TogglApi.handleError(error as AxiosError)
        }
    }

    async getCurrentEntry(): Promise<Nullable<TogglTimeEntry>> {
        const url = `${TogglApi.baseUrl}/api/v9/me/time_entries/current`
        try {
            const response = await this.http.get(url, {
                headers: this.basicHeaders
            })

            return response.data
        } catch (error) {
            TogglApi.handleError(error as AxiosError)
        }
    }

    async getProjectById(id: number): Promise<Nullable<TogglProject>> {
        const url = `${TogglApi.baseUrl}/api/v9/workspaces/${this.workspaceId}/projects/${id}`
        try {
            const response = await this.http.get(url, {
                headers: this.basicHeaders
            })
            const project = response.data
            return typeof project === "string" ? null : project as TogglProject
        } catch (error) {
            TogglApi.handleError(error as AxiosError)
        }
    }

    async getProjects(): Promise<Array<TogglProject>> {
        const queryString = new URLSearchParams({active: "true"})
        const url = `${TogglApi.baseUrl}/api/v9/workspaces/${this.workspaceId}/projects?${queryString}`
        try {
            const response = await this.http.get(url, {
                headers: this.basicHeaders,
            })
            return response.data
        } catch (error) {
            TogglApi.handleError(error as AxiosError)
        }
    }

    async getTimeEntries({from, to}: { from?: Date, to?: Date } = {}): Promise<Array<TogglTimeEntry>> {
        const queryString = new URLSearchParams()
        if (from && !to) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            queryString.set('start_date', TogglApi.formatDate(from))
            queryString.set('end_date', TogglApi.formatDate(tomorrow))
        }

        if (!from && to) {
            queryString.set('start_date', TogglApi.formatDate(new Date(0)))
            queryString.set('end_date', TogglApi.formatDate(to))
        }

        if (from && to) {
            queryString.set('start_date', TogglApi.formatDate(from))
            queryString.set('end_date', TogglApi.formatDate(to))
        }

        try {
            const url = [...queryString.entries()].length === 0
                ? `${TogglApi.baseUrl}/api/v9/me/time_entries`
                : `${TogglApi.baseUrl}/api/v9/me/time_entries?${queryString}`
            const response = await this.http.get(url, {
                headers: this.basicHeaders,
            })

            return response.data
        } catch (error) {
            TogglApi.handleError(error as AxiosError)
        }
    }

    async updateTimeEntry(id: number, update: Partial<TogglTimeEntry>): Promise<TogglTimeEntry> {
        const url = `${TogglApi.baseUrl}/api/v9/workspaces/${this.workspaceId}/time_entries/${id}`
        try {
            const response = await this.http.put(url, update, {
                headers: this.basicHeaders,
            })

            return response.data
        } catch (error) {
            TogglApi.handleError(error as AxiosError)
        }
    }
}

