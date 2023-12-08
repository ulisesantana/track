
export abstract class FileDb<T> {

    abstract get(key: keyof T): Promise<T[keyof T] | undefined>

    abstract set(key: keyof T, value: T[keyof T]): Promise<void>
}
