import { fileURLToPath } from 'node:url'
import { defineLogger } from 'reactive-vscode'
import { imageSize } from 'image-size'
import type { URI } from 'vscode-uri'
import to from 'await-to-js'

export const logger = defineLogger('Copy Image Size')

type T0 = typeof imageSize
type OverloadedReturnType<T> =
    T extends { (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R } ? R :
      T extends { (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R } ? R :
        T extends { (...args: any[]): infer R, (...args: any[]): infer R } ? R :
          T extends (...args: any[]) => infer R ? R : any
type T1 = OverloadedReturnType<T0>

/**
 * Description placeholder
 *
 * @async
 * @param {URI} uri
 * @returns {Promise<T1 | undefined | null | void>}
 */
export async function toResolveURI(uri: URI): Promise<T1 | undefined | null | void> {
  const fileUrl = uri.toString()

  const [filePathErr, fileAbsolutePath] = await to(Promise.resolve(fileURLToPath(fileUrl)))
  if (filePathErr || !fileAbsolutePath) {
    return logger.error('resolve fileUrl error: ', filePathErr)
  }

  const [dimensionsErr, dimensions] = await to(Promise.resolve(imageSize(fileAbsolutePath)))
  if (dimensionsErr || !dimensions) {
    return logger.error('resolve fileAbsolutePath error: ', dimensionsErr)
  }

  return dimensions
}
