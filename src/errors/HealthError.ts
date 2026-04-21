export class HealthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "HealthError";
    }
}   