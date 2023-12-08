import * as fs from 'fs-extra'

import {FileDb} from "./file-db";

export class FileSystemDataSource<T> extends FileDb<T> {
    private cache: T = {} as T

    constructor(private readonly configFilePath: string) {
        super();
    }

    async get(key: keyof T): Promise<T[keyof T] | undefined> {
        if (this.cache[key] !== undefined) {
            return this.cache[key]
        }

        const data = await fs.readJSON(this.configFilePath)
        this.cache = data
        return data[key]
    }

    async set(key: keyof T, value: T[keyof T]): Promise<void> {
        const data = await fs.readJSON(this.configFilePath)
        data[key] = value
        await fs.writeJSON(this.configFilePath, data)
        this.cache = data
    }
}
