import { CoreError } from './core.error'
import { ErrorCodes } from './error-codes'

export class ProjectNotFoundError extends CoreError {
  readonly code = ErrorCodes.ProjectNotFound

  constructor (key: number | string) {
    super(`Project "${key}" not found.`)
    this.name = 'ProjectNotFoundError'
  }
}
