export interface Configuration {
    apiToken: string
    defaultTimeEntry: string
    projectId: number
    workspaceId: number
}

export const defaultConfiguration: Configuration = {
    apiToken: '',
    defaultTimeEntry: '',
    projectId: -1,
    workspaceId: -1
}

export const configFilename = 'config.json'
