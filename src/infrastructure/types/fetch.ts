export type FetchFunction = (
    input: NodeJS.fetch.RequestInfo,
    init?: RequestInit,
) => Promise<Response>;
