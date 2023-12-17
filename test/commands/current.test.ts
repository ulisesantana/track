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

describe('current command runs', () => {
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

  it('showing current time entry', async () => {
    const [evilProject] = projects
    const {id} = evilProject
    const entry = buildTogglTimeEntry({project_id: id})
    httpMock
        .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
        .reply(200, entry)
        .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects/${id}`)
        .reply(200, evilProject)

    await config.runCommand("current")

    expect(stdoutStub.args.flat().join(',')).to.contains(`00h 30m 00s - Dummy time entry (Evil Company)`)
  })

  it('showing there is no entry running', async () => {
    httpMock
        .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
        .reply(200, null)

    await config.runCommand("current")

    expect(stdoutStub.args.flat().join(',')).to.contains(`There is no time entry running.`)
  })

})
