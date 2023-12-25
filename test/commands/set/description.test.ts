import * as inquirer from "@inquirer/prompts"
import {Config, ux} from "@oclif/core";
import {expect} from '@oclif/test'
import {writeJSON} from "fs-extra"
import path from "node:path";
import {SinonSandbox, SinonStub, createSandbox} from "sinon";

import {configuration} from "../../fixtures";

describe('set description command runs', () => {
    let sandbox: SinonSandbox
    let config: Config
    let stdoutStub: SinonStub
    const defaultTimeEntry = 'Working on stuff'

    beforeEach(async () => {
        sandbox = createSandbox()
        stdoutStub = sandbox.stub(ux.write, 'stdout')
        // @ts-expect-error Sinon unknown error
        sandbox.replace(inquirer, "input", async () => defaultTimeEntry);
        config = await Config.load({root: process.cwd()})
        config.configDir = path.join(process.cwd(), 'test/fixtures')
    })

    afterEach(async () => {
        sandbox.restore()
    })

    after(async () => {
        await writeJSON(path.join(config.configDir, 'config.json'), configuration)
    })

    it('set default time entry description', async () => {
        const expectedOutput = `Your default time entry description has been set to: "${defaultTimeEntry}"`;

        await config.runCommand("set:description")

        expect(stdoutStub.args.flat().join('')).to.contains(expectedOutput)
    })
})
