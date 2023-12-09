import {RequestError} from "./request-error";

export class AuthorizationError extends RequestError {
    public constructor() {
        super(403, "Authorization failure");
    }
}
