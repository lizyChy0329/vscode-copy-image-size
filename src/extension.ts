import { lstatSync } from 'node:fs'
import { basename, normalize, extname } from 'node:path'
import { defineExtension, useCommand, watchEffect } from 'reactive-vscode'
import { env, window, workspace, Uri } from 'vscode'
import to from 'await-to-js'
import { logger, toResolveURI, resolveImages } from './utils'
import { usePineConeWebviewView } from './webview'

type WebviewContext = {
  preventDefaultContextMenuItems: boolean;
  webview: string;
  webviewSection: string;
  selectedUri?: Uri;
}
type MaybeUriOrWebviewContext = Uri | WebviewContext;

function resolveVscodeOrWebviewUri(uri: MaybeUriOrWebviewContext) {
  let urix;
  if (uri instanceof Uri) {
    urix = uri
  } else {
    urix = uri.selectedUri
  }

  return {
    urix
  }
}

const { activate, deactivate } = defineExtension(() => {
  // Open Image Dock
  useCommand('copy-image-size.openPineCone', async (uri: MaybeUriOrWebviewContext) => {
    logger.info(`PineCone Start--------------------`)

    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    if (uri == null) {
      return window.showErrorMessage('Please input uri')
    }


    const stat = lstatSync(urix.fsPath)
    if (!stat.isDirectory()) {
      window.showErrorMessage('Please select a directory')
      return
    }

    const { postMessage, view } = usePineConeWebviewView()
    const currentWorkspaceFolder = workspace.getWorkspaceFolder(urix)

    if (!currentWorkspaceFolder) {
      window.showErrorMessage('Get Workspace Folder Fail')
      return
    }

    const subAssetsPath = urix.path.split(currentWorkspaceFolder!.name)[1]
    const currentAssetsPath = normalize(workspace!.workspaceFolders!.length > 1 ? `${currentWorkspaceFolder.name}${subAssetsPath}` : subAssetsPath)

    watchEffect(async () => {
      if (view.value) {
        const imagesData = await resolveImages(urix, view.value.webview);

        await postMessage({
          type: 'initImages',
          data: {
            currentAssetsPath,
            dirPath: urix,
            dirBaseName: basename(view.value.webview.asWebviewUri(urix).toString()),
            imagesData,
          }
        })
      }
    })

    logger.info(`PineCone End--------------------`)
  })

  // Copy Image Size to Tailwindcss: w-[100px] h-[100px]
  useCommand('copy-image-size.copyImageSizeToTailwind', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const dimensions = await toResolveURI(urix)

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
  useCommand('copy-image-size.copyImageSizeToCss', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const dimensions = await toResolveURI(urix)

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
  useCommand('copy-image-size.copyImageFullname', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const uriBasename = basename(uri.toString())

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(uriBasename)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`${uriBasename} copied!`)
  })

  // Copy Image Ext
  useCommand('copy-image-size.copyImageExt', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const uriExtname = extname(uri.toString())

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(uriExtname)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    window.showInformationMessage(`${uriExtname} copied!`)
  })
})

export { activate, deactivate }
