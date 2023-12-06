declare module 'configuration-store' {
    interface ConfigurationOptions {
        filename?: string
        filepath?: string
    }

    interface ConfigurationStore<T> {
        clear(): void;
        delete(key: keyof T): void;
        get<K extends keyof T>(key: K): T[K] | undefined;
        has(key: keyof T): boolean;
        set<K extends keyof T>(key: K, value: T[K]): void;
    }

    function generateConfigurationStore<T>(options?: ConfigurationOptions): ConfigurationStore<T>
    export = generateConfigurationStore;
}
