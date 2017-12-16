export class ConfigData<T> {
    protected configData:T = {} as T;

    setConfig(config:Partial<T>) {
        this.configData = {
            ...this.configData as any,
            ...config as any
        }
    }

    set<K extends keyof T>(key:K, val:T[K]) {
        return this.configData[key] = val;
    }

    get<K extends keyof T>(key:K):T[K] {
        return this.configData[key];
    }
}