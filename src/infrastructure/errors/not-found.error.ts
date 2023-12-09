import {RequestError} from "./request-error";

export class NotFoundError extends RequestError {
    public constructor(resource = 'Resource') {
        super(404, `${resource} not found`);
    }
}
