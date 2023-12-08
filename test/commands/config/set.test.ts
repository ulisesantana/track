import {Config, ux} from "@oclif/core";
import {expect} from '@oclif/test'
import * as fs from "fs-extra";
import path from "node:path";
import {SinonSandbox, SinonStub, createSandbox} from "sinon";

import {configFilename} from "../../../src/core";
import {configuration} from "../../fixtures";


describe('config:set command runs', () => {
    const apiToken = 'irrelevant-api-token'
    const description = 'Irrelevant time entry description'
    const projectId = Math.floor(Math.random() * 10**16)
    const workspaceId = Math.floor(Math.random() * 10**16)
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
        await fs.writeJSON(path.join(process.cwd(), 'test/fixtures', configFilename), configuration)
    })

    it('not doing anything if there is no flags', async () => {
        const expectedOutput = 'Missing properties to set. Check command help.'

        await config.runCommand("config:set")

        expect(stdoutStub.args.flat().join('').includes(expectedOutput)).to.be.true
    })

    it('updating single property successfully', async () => {
        const expectedOutput = `✅ Toggl API token set to ${apiToken}.`

        await config.runCommand("config:set", ['-t', apiToken])

        expect(stdoutStub.args.flat().join('')).to.contains(expectedOutput)
    })

    it('updating all properties successfully', async () => {
        const expectedOutput = ` - ✅ Default project set to ${projectId}.
 - ✅ Default time entry description set to "${description}".
 - ✅ Default workspace set to ${workspaceId}.
 - ✅ Toggl API token set to ${apiToken}.
`

        await config.runCommand("config:set", ['-t', apiToken, '-d', description, '-p', String(projectId), '-w', String(workspaceId)])

        expect(stdoutStub.args.flat().join('').includes(expectedOutput)).to.be.true
    })

})
