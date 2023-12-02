export * from './entities'
export * from './errors'
export * from './types'


export function isValidId(input: number | string): input is number {
   return /^\d+$/.test(String(input))
}
