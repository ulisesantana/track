import * as inquirer from "@inquirer/prompts"
import {Config, ux} from "@oclif/core";
import {expect} from '@oclif/test'
import {writeJSON} from "fs-extra"
import path from "node:path";
import {SinonSandbox, SinonStub, createSandbox} from "sinon";

import {configuration} from "../../fixtures";

describe('set token command runs', () => {
    let sandbox: SinonSandbox
    let config: Config
    let stdoutStub: SinonStub
    const mockToken = 'irrelevant-api-token'

    beforeEach(async () => {
        sandbox = createSandbox()
        stdoutStub = sandbox.stub(ux.write, 'stdout')
        // @ts-expect-error Sinon unknown error
        sandbox.replace(inquirer, "input", async () => mockToken);
        config = await Config.load({root: process.cwd()})
        config.configDir = path.join(process.cwd(), 'test/fixtures')
    })

    afterEach(async () => {
        sandbox.restore()
    })

    after(async () => {
        await writeJSON(path.join(config.configDir, 'config.json'), configuration)
    })

    it('set Toggl Track token', async () => {
        const expectedOutput = `Your Toggl Track token has been updated to: "${mockToken}".`;

        await config.runCommand("set:token")

        expect(stdoutStub.args.flat().join('')).to.contains(expectedOutput)
    })
})
