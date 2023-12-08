import {FileDb} from "../../src/infrastructure/data-sources";

export class FileSystemDataSourceDouble<T> extends FileDb<T> {
     constructor(public db: Partial<T> = {}) {
         super();
     }

    async clear(): Promise<void> {
        this.db = {}
    }

    async get(key: keyof T): Promise<T[keyof T] | undefined>  {
        return this.db[key]
    }

    async set(key: keyof T, value: T[keyof T]): Promise<void> {
        this.db[key] = value
    }

    async setData(db: Partial<T>): Promise<void> {
        this.db = db
    }
}


