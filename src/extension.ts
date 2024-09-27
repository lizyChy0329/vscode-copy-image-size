import { lstatSync } from 'node:fs'
import { defineExtension, useCommand } from 'reactive-vscode'
import { env, window } from 'vscode'
import type { URI } from 'vscode-uri'
import { Utils } from 'vscode-uri'
import to from 'await-to-js'
import { logger, toResolveURI } from './utils'
import { usePineConeWebviewView } from './webview'

const { activate, deactivate } = defineExtension(() => {
  // Open Image Dock
  useCommand('copy-image-size.openImageDock', async (uri: URI) => {
    logger.info(`PineCone Dock Start--------------------`)
    logger.info(`uri: ${uri}`)

    if (uri == null)
      return

    const stat = lstatSync(uri.fsPath)
    if (!stat.isDirectory()) {
      logger.error('Please select a dir!')
      window.showErrorMessage('Please select a dir!')
      return
    }

    const { message, postMessage } = usePineConeWebviewView(uri)

    await postMessage('ji ni tai mei')
    // const dimensions = await toResolveURI(uri)

    // if (!dimensions) {
    //   return window.showErrorMessage(`copyImageSizeToCSS.toResolveURI(uri) is Error`)
    // }

    // const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(`width: ${dimensions?.width}px; height: ${dimensions?.height}px;`)))
    // if (clipboardErr) {
    //   return logger.error(clipboardErr)
    // }

    window.showInformationMessage(message.value)

    logger.info(`PineCone Dock End--------------------`)
  })

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
