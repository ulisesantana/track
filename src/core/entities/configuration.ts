export interface Configuration {
    apiKey: string
    defaultTimeEntry: string
    projectId: number
    workspaceId: number
}

export const defaultConfiguration: Configuration = {
    apiKey: '',
    defaultTimeEntry: '',
    projectId: -1,
    workspaceId: -1
}
