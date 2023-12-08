import {Config, ux} from "@oclif/core";
import {expect} from '@oclif/test'
import {EOL} from "node:os";
import path from "node:path";
import {SinonSandbox, SinonStub, createSandbox} from "sinon";

import {configuration} from "../../fixtures";

describe('config command runs', () => {
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
  })

  it('showing config successfully', async () => {
    const expectedOutput = Object.entries(configuration).map(([k,v]) => ` - ${k}: ${v}`).join(EOL)

    await config.runCommand("config")

    expect(stdoutStub.args.flat().join('')).to.contains(expectedOutput)
  })
})
