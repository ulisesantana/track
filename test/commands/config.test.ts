import {expect, test} from '@oclif/test'
import {EOL} from "node:os";

import ConfigCommand from '../../src/commands/config'
import {defaultConfiguration} from "../../src/core";

const error = new Error('Something weird happened');
describe('config command runs', () => {

  test
  .stdout()
  .stub(ConfigCommand.configurationRepository, 'getAll', (stub) => stub.resolves(defaultConfiguration))
  .command(['config'])
  .it('showing config successfully', ctx => {
    const expectedOutput = Object.entries(defaultConfiguration).map(([k,v]) => ` - ${k}: ${v}`).join(EOL)
    expect(ctx.stdout).to.contain(expectedOutput)
  })

  test
  .stdout()
  .stub(ConfigCommand.configurationRepository, 'getAll', (stub) => stub.rejects(error))
  .command(['config'])
  .it('showing an error while retrieving config', ctx => {
    expect(ctx.stdout).to.contain(`There was an error trying to get your config. Detailed error:${EOL}${error}`)
  })
})
