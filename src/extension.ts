import { lstatSync } from 'node:fs'
import { basename, normalize, extname } from 'node:path'
import { defineExtension, useCommand, watchEffect } from 'reactive-vscode'
import { env, window, workspace, Uri, commands, ViewColumn } from 'vscode'
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
  /**
   * Open PineCone Gallery
   * Open
   * Location
   * Explorer
   * Copy
   * Delete
   */
  useCommand('copy-image-size.openPineCone', async (uri: MaybeUriOrWebviewContext) => {
    logger.clear()
    logger.info(`---PineCone Create Start---`)

    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    logger.info(`---ResolveVscodeOrWebviewUri success---`)

    commands.executeCommand('setContext', 'copy-image-size.showPineConeGalleryIcon', true);

    const { postMessage, view } = usePineConeWebviewView()
    const currentWorkspaceFolder = workspace.getWorkspaceFolder(urix)

    if (!currentWorkspaceFolder) {
      commands.executeCommand('setContext', 'copy-image-size.showPineConeGalleryIcon', false);
      window.showErrorMessage('Get Workspace Folder Fail')
      return
    }

    const subAssetsPath = urix.path.split(currentWorkspaceFolder!.name)[1]
    const currentAssetsPath = normalize(workspace!.workspaceFolders!.length > 1 ? `${currentWorkspaceFolder.name}${subAssetsPath}` : subAssetsPath)

    watchEffect(async () => {
      logger.info(`---PineConeWebviewView Status: ${view.value}---`)

      if (view.value) {
        logger.info(`---PineConeWebviewView Create Success---`)

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

        // focus to Activitybar pinecone icon
        commands.executeCommand("1_pineconeViews.focus", {
          preserveFocus: true
        })
      }
    })

    logger.info(`---PineCone Create End---`)
  })

  /**
   * Context Menus - Commands
   */
  // open Image with text editor
  useCommand('copy-image-size.openWithTextEditor', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const [openImageErr] = await to(Promise.resolve(commands.executeCommand('vscode.openWith', urix, 'imagePreview.previewEditor', ViewColumn.Active)))
    if (openImageErr) {
      return logger.error(openImageErr)
    }

  })

  // locate the webview Image
  useCommand('copy-image-size.locateImage', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const [locateImageErr] = await to(Promise.resolve(commands.executeCommand('revealInExplorer', urix)))
    if (locateImageErr) {
      return logger.error(locateImageErr)
    }

  })

  // open Image in Explorer
  useCommand('copy-image-size.openExplorerWithImage', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const [explorerImageErr] = await to(Promise.resolve(commands.executeCommand('revealFileInOS', urix)))
    if (explorerImageErr) {
      return logger.error(explorerImageErr)
    }

  })

  /**
   * Context Menus - Copy
   */
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

  // Copy Image Basename
  useCommand('copy-image-size.copyImageBasename', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const uriBasename = basename(urix.toString())

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(uriBasename)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    // window.showInformationMessage(`${uriBasename} copied!`)
  })

  // Copy Image Extname
  useCommand('copy-image-size.copyImageExtname', async (uri: MaybeUriOrWebviewContext) => {
    const { urix } = resolveVscodeOrWebviewUri(uri)
    if (!urix) {
      return window.showErrorMessage(`urix is undefinded`)
    }

    const uriExtname = extname(urix.toString())

    const [clipboardErr] = await to(Promise.resolve(env.clipboard.writeText(uriExtname)))
    if (clipboardErr) {
      return logger.error(clipboardErr)
    }

    // window.showInformationMessage(`${uriExtname} copied!`)
  })
})

export { activate, deactivate }
