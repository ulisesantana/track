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

describe('today command runs', () => {
  const projects = [buildTogglProject({id: 1, name: 'Evil Company'}), buildTogglProject({id: 2, name: 'Good Company'})]
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const queryString = new URLSearchParams()
  queryString.set('start_date', today.toISOString().split('T').at(0)!)
  queryString.set('end_date', tomorrow.toISOString().split('T').at(0)!)
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

  it('showing today report', async () => {
    const [evilProject] = projects
    const {id} = evilProject
    const entries = [
        buildTogglTimeEntry({project_id: id}),
        buildTogglTimeEntry({project_id: id})
    ]
    httpMock
        .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries?${queryString}`)
        .reply(200, entries)
        .onGet(`${TogglApi.baseUrl}/api/v9/workspaces/${configuration.workspaceId}/projects?active=true`)
        .reply(200, projects)

    await config.runCommand("today")

    expect(stdoutStub.args.flat().join(',')).to.contains(`01h 00m 00s
  - 01h 00m 00s - Dummy time entry (Evil Company)`)
  })

  it('showing there is no entries for today', async () => {
    httpMock
        .onGet(`${TogglApi.baseUrl}/api/v9/me/time_entries?${queryString}`)
        .reply(200, [])

    await config.runCommand("today")

    expect(stdoutStub.args.flat().join(',')).to.contains(`There are no entries for today.`)
  })

})
