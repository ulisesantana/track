/* eslint-disable camelcase */
import {Config, ux} from '@oclif/core'
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from "node:path";
import {SinonSandbox, SinonStub, createSandbox} from 'sinon'

import {TogglApi} from "../../src/infrastructure/data-sources";
import {buildTogglProject, buildTogglTimeEntry} from "../builders";
import {configuration} from "../fixtures";
import httpMock from "../http.mock";

chai.use(chaiAsPromised);
const {expect} = chai;

describe('week command runs', () => {
  const projects = [buildTogglProject({id: 1, name: 'Evil Company'}), buildTogglProject({id: 2, name: 'Good Company'})]
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

  it('showing current week report grouping entries by description', async () => {
    const [evilProject] = projects
    const {id} = evilProject
    const entries = [
        buildTogglTimeEntry({project_id: id}),
        buildTogglTimeEntry({project_id: id})
    ]
    httpMock
        .onGet(/\/me\/time_entries/)
        .reply(200, entries)
        .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects?active=true`)
        .reply(200, projects)

    await config.runCommand("week")

    expect(stdoutStub.args.flat().join(',')).to.contains(`01h 00m 00s
  - 01h 00m 00s - Dummy time entry (Evil Company)`)
  })

  it('showing there is no entries for from', async () => {
    httpMock
        .onGet(/\/me\/time_entries/)
        .reply(200, [])
        .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects?active=true`)
        .reply(200, projects)

    await config.runCommand("week")

    expect(stdoutStub.args.flat().join(',')).to.contains(`There are no entries for the current week.`)
  })

})
