/* eslint-disable camelcase */
import MockAdapter from "axios-mock-adapter";
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const {expect} = chai;


import {TogglApi, http} from "../../../src/infrastructure/data-sources";
import {AuthorizationError, NotFoundError, RequestError, ServerError} from "../../../src/infrastructure/errors";
import {buildTogglProject, buildTogglTimeEntry} from "../../builders";

const mock = new MockAdapter(http);

describe('Toggl API should', () => {
    const workspaceId = 42;
    const api = new TogglApi({http, token: 'irrelevant-token', workspaceId})
    const projects = [buildTogglProject({name: 'Evil Company'}), buildTogglProject({name: 'Good Company'})]

    afterEach(() => {
        mock.reset()
    })

    describe('create time entry', () => {
        it('successfully', async () => {
            const start = new Date()
            const entry = buildTogglTimeEntry()
            mock
                .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/time_entries`)
                .reply(({data}) => [200, data])

            const result = await api.createTimeEntry(entry, start)

            expect(result).to.deep.equal({
                ...entry,
                created_with: "track CLI",
                duration: -1,
                start: start.toISOString(),
                workspace_id: workspaceId,
            })
        })
        it('handle authorization error', async () => {
            const expectedError = new AuthorizationError()
            const start = new Date()
            const entry = buildTogglTimeEntry()
            mock
                .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/time_entries`)
                .reply(403)

            await expect(api.createTimeEntry(entry, start)).to.rejectedWith(expectedError.message)
        })
        it('handle server internal error', async () => {
            const expectedError = new ServerError()
            const start = new Date()
            const entry = buildTogglTimeEntry()
            mock
                .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/time_entries`)
                .reply(500)

            await expect(api.createTimeEntry(entry, start)).to.rejectedWith(expectedError.message)
        })
        it('handle any other error', async () => {
            const expectedError = new RequestError(420, 'Request failed with status code 420')
            const start = new Date()
            const entry = buildTogglTimeEntry()
            mock
                .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/time_entries`)
                .reply(420)

            await expect(api.createTimeEntry(entry, start)).to.rejectedWith(expectedError.message)
        })
    })


    describe('get current entry', () => {
        it('successfully', async () => {
            const entry = buildTogglTimeEntry()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
                .reply(200, entry)

            const result = await api.getCurrentEntry()

            expect(result).to.deep.equal(entry)
        })
        it('handle authorization error', async () => {
            const expectedError = new AuthorizationError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
                .reply(403)

            await expect(api.getCurrentEntry()).to.rejectedWith(expectedError.message)
        })
        it('handle no current time entry', async () => {
            const expectedError = new NotFoundError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
                .reply(404)

            await expect(api.getCurrentEntry()).to.rejectedWith(expectedError.message)
        })
        it('handle server internal error', async () => {
            const expectedError = new ServerError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
                .reply(500)

            await expect(api.getCurrentEntry()).to.rejectedWith(expectedError.message)
        })
        it('handle any other error', async () => {
            const expectedError = new RequestError(420, 'Request failed with status code 420')
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
                .reply(420)

            await expect(api.getCurrentEntry()).to.rejectedWith(expectedError.message)
        })
    })


    describe('get project by id', () => {
        const [project] = projects
        it('successfully', async () => {
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/projects/${project.id}`)
                .reply(200, project)

            const result = await api.getProjectById(project.id)

            expect(result).to.deep.equal(project)
        })
        it('handle authorization error', async () => {
            const expectedError = new AuthorizationError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/projects/${project.id}`)
                .reply(403)

            await expect(api.getProjectById(project.id)).to.rejectedWith(expectedError.message)
        })
        it('handle server internal error', async () => {
            const expectedError = new ServerError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/projects/${project.id}`)
                .reply(500)

            await expect(api.getProjectById(project.id)).to.rejectedWith(expectedError.message)
        })
        it('handle any other error', async () => {
            const expectedError = new RequestError(420, 'Request failed with status code 420')
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/projects/${project.id}`)
                .reply(420)

            await expect(api.getProjectById(project.id)).to.rejectedWith(expectedError.message)
        })
    })

    describe('get all projects', () => {
        it('successfully', async () => {
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/projects?active=true`)
                .reply(200, projects)

            const result = await api.getProjects()

            expect(result).to.deep.equal(projects)
        })
        it('handle authorization error', async () => {
            const expectedError = new AuthorizationError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/projects?active=true`)
                .reply(403)

            await expect(api.getProjects()).to.rejectedWith(expectedError.message)
        })
        it('handle server internal error', async () => {
            const expectedError = new ServerError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/projects?active=true`)
                .reply(500)

            await expect(api.getProjects()).to.rejectedWith(expectedError.message)
        })
        it('handle any other error', async () => {
            const expectedError = new RequestError(420, 'Request failed with status code 420')
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/projects?active=true`)
                .reply(420)

            await expect(api.getProjects()).to.rejectedWith(expectedError.message)
        })
    })

    describe('get time entries', () => {
        const entries = [buildTogglTimeEntry(), buildTogglTimeEntry()]
        it('without any date range', async () => {
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries`)
                .reply(200, entries)

            const result = await api.getTimeEntries()

            expect(result).to.deep.equal(entries)
        })
        it('with from date', async () => {
            const from = new Date('2023-05-15')
            const to = new Date()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries?start_date=${formatDate(from)}&end_date=${formatDate(to)}`)
                .reply(200, entries)

            const result = await api.getTimeEntries({from})

            expect(result).to.deep.equal(entries)
        })
        it('with to date', async () => {
            const from = new Date(0)
            const to = new Date('2023-12-01')
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries?start_date=${formatDate(from)}&end_date=${formatDate(to)}`)
                .reply(200, entries)

            const result = await api.getTimeEntries({to})

            expect(result).to.deep.equal(entries)
        })
        it('with from and to date', async () => {
            const from = new Date('2023-05-15')
            const to = new Date('2023-12-01')
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries?start_date=${formatDate(from)}&end_date=${formatDate(to)}`)
                .reply(200, entries)

            const result = await api.getTimeEntries({from, to})

            expect(result).to.deep.equal(entries)
        })
        it('handle authorization error', async () => {
            const expectedError = new AuthorizationError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries`)
                .reply(403)

            await expect(api.getTimeEntries()).to.rejectedWith(expectedError.message)
        })
        it('handle server internal error', async () => {
            const expectedError = new ServerError()
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries`)
                .reply(500)

            await expect(api.getTimeEntries()).to.rejectedWith(expectedError.message)
        })
        it('handle any other error', async () => {
            const expectedError = new RequestError(420, 'Request failed with status code 420')
            mock
                .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries`)
                .reply(420)

            await expect(api.getTimeEntries()).to.rejectedWith(expectedError.message)
        })
    })

    describe('update time entry', () => {
            const entry = buildTogglTimeEntry()
        it('successfully', async () => {
            mock
                .onPut(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/time_entries/${entry.id}`)
                .reply(({data}) => [200, data])

            const result = await api.updateTimeEntry(entry.id, entry)

            expect(result).to.deep.equal(entry)
        })
        it('handle authorization error', async () => {
            const expectedError = new AuthorizationError()
            mock
                .onPut(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/time_entries/${entry.id}`)
                .reply(403)

            await expect(api.updateTimeEntry(entry.id, entry)).to.rejectedWith(expectedError.message)
        })
        it('handle server internal error', async () => {
            const expectedError = new ServerError()
            mock
                .onPut(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/time_entries/${entry.id}`)
                .reply(500)

            await expect(api.updateTimeEntry(entry.id, entry)).to.rejectedWith(expectedError.message)
        })
        it('handle any other error', async () => {
            const expectedError = new RequestError(420, 'Request failed with status code 420')
            mock
                .onPut(`${TogglApi.baseUrl}/api/v9/workspaces/${workspaceId}/time_entries/${entry.id}`)
                .reply(420)

            await expect(api.updateTimeEntry(entry.id, entry)).to.rejectedWith(expectedError.message)
        })
    })
})

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
}
