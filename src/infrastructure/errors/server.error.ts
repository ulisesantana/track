import {RequestError} from "./request-error";

export class ServerError extends RequestError {
    public constructor() {
        super(500, "Server Internal Error");
    }
}
