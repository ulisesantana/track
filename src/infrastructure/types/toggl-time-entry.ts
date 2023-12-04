export interface TogglTimeEntry {
    at?: string
    description: string
    duration: number
    id: number
    project_id: number
    start?: string
    stop?: string
    tags?: string[]
    user_id?: number
    workspace_id?: number
}
