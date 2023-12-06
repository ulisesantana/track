import {FileDb} from "./file-db";

export class FileSystemDataSource<T> extends FileDb<T> {

    constructor(private readonly db: FileDb<T>) {
        super();
    }

    get(key: keyof T): T[keyof T] | undefined {
        return this.db.get(key)
    }

    set(key: keyof T, value: T[keyof T]): void {
        this.db.set(key, value)
    }
}
