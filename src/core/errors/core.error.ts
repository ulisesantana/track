/* eslint-disable perfectionist/sort-classes */
import { ErrorCodes } from './error-codes'
export abstract class CoreError extends Error {
  abstract readonly code: ErrorCodes

  protected constructor (message: string) {
    super(message)
  }

  static isError (error: unknown): error is CoreError {
    return typeof error === 'object' &&
      error !== null &&
      Object.hasOwn(error, 'code') &&
      Object.hasOwn(error, 'message')
  }
}
