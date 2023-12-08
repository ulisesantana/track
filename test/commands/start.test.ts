/* eslint-disable camelcase */
import {Config, ux} from '@oclif/core'
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {expect} from 'chai'
import path from "node:path";
import {SinonSandbox, SinonStub, createSandbox} from 'sinon'

import {TogglApi} from "../../src/infrastructure/data-sources";
import {buildTogglProject, buildTogglTimeEntry} from "../builders";
import {configuration} from "../fixtures";

const mock = new MockAdapter(axios);

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
        mock.restore()
    })


    it('creating entry by passing all arguments and flags', async () => {
        const [evilProject] = projects
        const {id, name} = evilProject
        mock
            .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects?active=true`)
            .reply(200, projects)
            .onPost(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/time_entries`)
            .reply(200, buildTogglTimeEntry({description: configuration.defaultTimeEntry, project_id: id}))

        await config.runCommand("start", [configuration.defaultTimeEntry, "-p", name])

        expect(stdoutStub.args.flat().join(',')).to.contains(`Started time entry "${configuration.defaultTimeEntry}" for "${name}" project.`)
    })

    it('creating entry using default project')
    it('creating entry using default time entry')
    it('creating entry using default time entry and default project')

})
