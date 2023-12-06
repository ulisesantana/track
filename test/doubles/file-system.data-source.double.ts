import {FileDb} from "../../src/infrastructure/data-sources";

export class FileSystemDataSourceDouble<T> extends FileDb<T> {
     constructor(public db: Partial<T> = {}) {
         super();
     }

    clear(): void {
        this.db = {}
    }

    get(key: keyof T): T[keyof T] | undefined  {
        return this.db[key]
    }

    set(key: keyof T, value: T[keyof T]): void {
        this.db[key] = value
    }

    setData(db: Partial<T>): void {
        this.db = db
    }
}


