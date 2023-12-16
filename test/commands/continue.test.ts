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

describe('continue command runs', () => {
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

    it('creating new entry based on last entry', async () => {
        const [evilProject] = projects
        const {id: projectId, name} = evilProject
        const entry = buildTogglTimeEntry({project_id: projectId})

        httpMock
            .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries`)
            .reply(200, [entry])
            .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects/${projectId}`)
            .reply(200, evilProject)
            .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/time_entries`)
            .reply(200, entry)

        await config.runCommand("continue", [])

        expect(stdoutStub.args.flat().join(',')).to.contains(`Continuing with time entry "${entry.description}" for "${name}" project.`)
    })


    it('showing there is no time entry to continue with', async () => {
        httpMock
            .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries`)
            .reply(200, [])

        await config.runCommand("continue", [])

        expect(stdoutStub.args.flat().join(',')).to.contains(`There is no time entry to continue with.`)
    })

})
