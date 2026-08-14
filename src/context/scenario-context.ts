export class ScenarioContext {
    private context: Map<string, unknown> = new Map();

    set<T>(key: string, value: T): void {
        this.context.set(key, value);
    }

    get<T>(key: string): T {
        const value = this.context.get(key);

        if (value === undefined) {
            throw new Error(`ScenarioContext: key "${key}" was not found`);
        }

        return value as T;
    }

    has(key: string): boolean {
        return this.context.has(key);
    }

    clear(): void {
        this.context.clear();
    }
}