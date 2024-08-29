import { fileURLToPath } from 'node:url'
import { defineExtension, useCommand } from 'reactive-vscode'
import { env, window } from 'vscode'
import { imageSize } from 'image-size'
import { Utils } from 'vscode-uri'
import to from 'await-to-js'
// import { message } from './configs'
import { logger } from './utils'

// async function toResolve<T>(func: T): Promise<Awaited<T>> {
//   const [err, data] = await to(Promise.resolve(func))
//   if (err || !data) {
//     return logger.error(err)
//   }

//   return data
// }

const { activate, deactivate } = defineExtension(() => {
  // Copy Image Fullname
  useCommand('copy-image-size.copyImageFullname', async (uri) => {
    const uriBasename = Utils.basename(uri)

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(uriBasename)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`${uriBasename} is copy success!`)
  })

  // Copy Image Size to Tailwindcss: w-[100px] h-[100px]
  useCommand('copy-image-size.copyImageSizeToTailwind', async (uri) => {
    const fileUrl = uri.toString()

    const [filePathErr, fileAbsolutePath] = await to(Promise.resolve(fileURLToPath(fileUrl)))
    if (filePathErr || !fileAbsolutePath) {
      return logger.error(filePathErr)
    }

    const [dimensionsErr, dimensions] = await to(Promise.resolve(imageSize(fileAbsolutePath)))
    if (dimensionsErr || !dimensions) {
      return logger.error(dimensionsErr)
    }

    // size-[]
    if (dimensions?.width === dimensions?.height) {
      const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(`size-[${dimensions?.width}px]`)))
      if (clipboardErr) {
        return logger.error(clipboardErr)
      }

      return window.showInformationMessage(`size-[${dimensions?.width}px] utility is copy success!`)
    }

    // w-[] h-[]
    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(`w-[${dimensions?.width}px] h-[${dimensions?.height}px]`)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`w-[${dimensions?.width}px] h-[${dimensions?.height}px] utility is copy success!`)
  })

  // Copy Image Ext
  useCommand('copy-image-size.copyImageExt', async (uri) => {
    const uriExtname = Utils.extname(uri)

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(uriExtname)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`${uriExtname} is copy success!`)
  })
})

export { activate, deactivate }
