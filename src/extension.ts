import { fileURLToPath } from 'node:url'
import { defineExtension, useCommand } from 'reactive-vscode'
import { env, window } from 'vscode'
import { imageSize } from 'image-size'
import type { URI } from 'vscode-uri'
import { Utils } from 'vscode-uri'
import to from 'await-to-js'
// import { message } from './configs'
import { logger } from './utils'

type T0 = typeof imageSize
type OverloadedReturnType<T> =
    T extends { (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R } ? R :
      T extends { (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R } ? R :
        T extends { (...args: any[]): infer R, (...args: any[]): infer R } ? R :
          T extends (...args: any[]) => infer R ? R : any
type T1 = OverloadedReturnType<T0>

async function toResolveURI(uri: URI): Promise<T1 | undefined | null | void> {
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

const { activate, deactivate } = defineExtension(() => {
  // Copy Image Size to Tailwindcss: w-[100px] h-[100px]
  useCommand('copy-image-size.copyImageSizeToTailwind', async (uri: URI) => {
    const dimensions = await toResolveURI(uri)

    if (!dimensions) {
      return window.showErrorMessage(`copyImageSizeToTailwind.toResolveURI(uri) is Error`)
    }

    // size-[]
    if (dimensions?.width === dimensions?.height) {
      const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(`size-[${dimensions?.width}px]`)))
      if (clipboardErr) {
        return logger.error(clipboardErr)
      }

      return window.showInformationMessage(`size-[${dimensions?.width}px] copied!`)
    }

    // w-[] h-[]
    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(`w-[${dimensions?.width}px] h-[${dimensions?.height}px]`)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`w-[${dimensions?.width}px] h-[${dimensions?.height}px] copied!`)
  })

  // Copy Image Size to CSS: width: 100px height: 100px
  useCommand('copy-image-size.copyImageSizeToCss', async (uri) => {
    const dimensions = await toResolveURI(uri)

    if (!dimensions) {
      return window.showErrorMessage(`copyImageSizeToCSS.toResolveURI(uri) is Error`)
    }

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(`width: ${dimensions?.width}px; height: ${dimensions?.height}px;`)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`width: ${dimensions?.width}px; height: ${dimensions?.height}px; copied!`)
  })

  // Copy Image Fullname
  useCommand('copy-image-size.copyImageFullname', async (uri) => {
    const uriBasename = Utils.basename(uri)

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(uriBasename)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`${uriBasename} copied!`)
  })

  // Copy Image Ext
  useCommand('copy-image-size.copyImageExt', async (uri) => {
    const uriExtname = Utils.extname(uri)

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(uriExtname)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`${uriExtname} copied!`)
  })
})

export { activate, deactivate }
