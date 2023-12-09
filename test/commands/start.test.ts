/* eslint-disable camelcase */
import {Config, ux} from '@oclif/core'
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from "node:path";
import {SinonSandbox, SinonStub, createSandbox} from 'sinon'

import {TogglApi} from "../../src/infrastructure/data-sources";
import {buildTogglProject, buildTogglTimeEntry} from "../builders";
import {configuration} from "../fixtures";
import httpMock from "../http.mock"

chai.use(chaiAsPromised);
const {expect} = chai;

describe('start command runs', () => {
    const projects = [buildTogglProject({name: 'Evil Company'}), buildTogglProject({name: 'Good Company'})]
    let sandbox: SinonSandbox
    let config: Config
    let stdoutStub: SinonStub

    beforeEach(async () => {
        sandbox = createSandbox()
        stdoutStub = sandbox.stub(ux.write, 'stdout')
        config = await Config.load({root: process.cwd()})
        config.configDir = path.join(process.cwd(), 'test/fixtures')
    })

    afterEach(async () => {
        sandbox.restore()
        httpMock.reset()
    })

    it('creating entry by passing all arguments and flags', async () => {
        const [evilProject] = projects
        const {id, name} = evilProject
        httpMock.onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects?active=true`)
            .reply(200, projects)
            .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/time_entries`)
            .reply(200, buildTogglTimeEntry({description: configuration.defaultTimeEntry, project_id: id}))

        await config.runCommand("start", [configuration.defaultTimeEntry, "-p", name])

        expect(stdoutStub.args.flat().join(',')).to.contains(`Started time entry "${configuration.defaultTimeEntry}" for "${name}" project.`)
    })

    it('creating entry using default project', async () => {
        const projects = [buildTogglProject({
            id: configuration.projectId,
            name: 'Evil Company'
        }), buildTogglProject({name: 'Good Company'})]
        const [evilProject] = projects
        const {id, name} = evilProject
        httpMock
            .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects/${id}`)
            .reply(200, evilProject)
            .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/time_entries`)
            .reply(200, buildTogglTimeEntry({description: configuration.defaultTimeEntry, project_id: id}))

        await config.runCommand("start", [configuration.defaultTimeEntry])

        expect(stdoutStub.args.flat().join(',')).to.contains(`Started time entry "${configuration.defaultTimeEntry}" for "${name}" project.`)
    })

    it('creating entry using default time entry', async () => {
        const [evilProject] = projects
        const {id, name} = evilProject
        httpMock
            .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects/${id}`)
            .reply(200, evilProject)
            .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/time_entries`)
            .reply(200, buildTogglTimeEntry({description: configuration.defaultTimeEntry, project_id: id}))

        await config.runCommand("start", ["-p", id.toString()])

        expect(stdoutStub.args.flat().join(',')).to.contains(`Started time entry "${configuration.defaultTimeEntry}" for "${name}" project.`)
    })

    it('creating entry using default time entry and default project', async () => {
        const projects = [buildTogglProject({
            id: configuration.projectId,
            name: 'Evil Company'
        }), buildTogglProject({name: 'Good Company'})]
        const [evilProject] = projects
        const {id, name} = evilProject
        httpMock
            .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects/${id}`)
            .reply(200, evilProject)
            .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/time_entries`)
            .reply(200, buildTogglTimeEntry({description: configuration.defaultTimeEntry, project_id: id}))

        await config.runCommand("start")

        expect(stdoutStub.args.flat().join(',')).to.contains(`Started time entry "${configuration.defaultTimeEntry}" for "${name}" project.`)
    })

    it('showing error if description is missing and default time entry description is not defined', async () => {
        config.configDir = path.join(process.cwd(), 'test/fixtures/min-config')
        const [evilProject] = projects
        const {id} = evilProject

        await expect(config.runCommand("start", ["-p", id.toString()]))
            .to.be.rejectedWith("Missing time entry description argument")
    })

    it('showing error if project is missing and default project id is not defined', async () => {
        config.configDir = path.join(process.cwd(), 'test/fixtures/min-config')

        await expect(config.runCommand("start", ["Doing stuff"]))
            .to.be.rejectedWith("Missing project flag for the time entry.")
    })

})
