/* eslint-disable unicorn/filename-case */
import {Hook} from '@oclif/core'
import * as fs from "fs-extra";
import path from "node:path";

import {configFilename} from "../../core";

const hook: Hook<'init'> = async function (opts) {
    const filePath = path.join(opts.config.configDir, configFilename)
    try {
        await fs.readJSON(filePath)
    } catch {
        if (!(await fs.pathExists(opts.config.configDir))) {
            await fs.mkdirp(opts.config.configDir)
        }

        await fs.writeJSON(filePath, {})
        this.log(`Config file created at "${filePath}".`)
    }
}

export default hook
