export class GenerateData {
    static username(prefix: string): string {
        const randomChars = Math.random()
            .toString(36)
            .substring(2, 7);
        return `${prefix}_${Date.now()}_${randomChars}`;
    }
}