
export interface ValidationResponse {
    error: boolean, message: string
}

export const okResponse: ValidationResponse = {
    error: false,
    message: ''
}
