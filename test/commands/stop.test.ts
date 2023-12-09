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

describe('stop command runs', () => {
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

  it('stopping current time entry', async () => {
    const [evilProject] = projects
    const {id, name} = evilProject
    const entry = buildTogglTimeEntry({project_id: id})
    httpMock.onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
        .reply(200, entry)
        .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects/${id}`)
        .reply(200, evilProject)
        .onPut(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/time_entries/${entry.id}`)
        .reply(200, entry)

    await config.runCommand("stop")

    expect(stdoutStub.args.flat().join(',')).to.contains(`Time entry "${entry.description}" stopped for "${name}" project.`)
  })

  it('showing there is no entry to stop if there is no current time entry', async () => {
    httpMock.onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries/current`)
        .reply(200, null)

    await config.runCommand("stop")

    expect(stdoutStub.args.flat().join(',')).to.contains(`There is no time entry running.`)
  })

})
