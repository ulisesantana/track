export class RequestError extends Error {
    constructor(public code: number, errorMessage: string) {
        super(`${errorMessage}`);
        this.code = code;
    }

    toString() {
        return `${this.code} - ${this.message}`
    }
}
