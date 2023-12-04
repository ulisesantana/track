import Conf from "conf";

import {Configuration, defaultConfiguration} from "../../core";

export class ConfigDataSource {
    constructor(private readonly config: Conf) {
    }

    get(key: keyof Configuration): Configuration[keyof Configuration] {
        return this.config.get(key, defaultConfiguration[key])
    }

    set(key: keyof Configuration, value: Configuration[keyof Configuration]): void {
        this.config.set(key, value)
    }
}
