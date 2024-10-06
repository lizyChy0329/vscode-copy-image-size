import { lstatSync, readdirSync } from 'node:fs'
import { join, normalize, parse } from 'node:path'
import type { Ref } from 'reactive-vscode'
import { computed, createSingletonComposable, extensionContext, ref, useWebviewPanel, useWebviewView } from 'reactive-vscode'
import { URI } from 'vscode-uri'
import { Uri, ViewColumn } from 'vscode'
import { logger } from './utils'

interface PineConeWebviewViewReturnType {
  message: Ref<string>
  postMessage: (message: any) => void
}

/**
 * 获取选中文件,或文件夹下的文件
 * @param dUri
 * @param depth
 * @param currentDepth
 */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff']
const EXCLUDE_DIR = ['node_modules']

export function getImages(dUri: URI, depth: number = Infinity, currentDepth: number = 0): string[] {
  const filePaths: string[] = []

  // 检查当前深度是否超过限制
  if (currentDepth > depth) {
    return filePaths
  }

  const stat = lstatSync(dUri.fsPath)

  if (stat.isDirectory()) {
    const files = readdirSync(dUri.fsPath)

    for (const file of files) {
      if (EXCLUDE_DIR.includes(file)) {
        continue
      }

      const filePath = normalize(join(dUri.fsPath, `${file}`))
      const fileStat = lstatSync(filePath)

      if (fileStat.isDirectory()) {
        // 如果是目录，递归调用
        getImages(URI.parse(filePath), depth, currentDepth + 1)
      }
      else {
        // 检查文件扩展名是否是图片格式
        const extension = parse(filePath)?.ext?.toLowerCase()
        if (IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
          filePaths.push(filePath)
        }
      }
    }
  }

  return filePaths
}

export function usePineConeWebviewView(directoryUri: URI): PineConeWebviewViewReturnType {
  const images = getImages(directoryUri)

  // const dimensions = await toResolveURI(uri)

  // if (!dimensions) {
  //   return window.showErrorMessage(`copyImageSizeToTailwind.toResolveURI(uri) is Error`)
  // }

  return createSingletonComposable(() => {
    const message = ref('')

    const { panel } = useWebviewPanel('images-preview', 'images-preview', ref(''), ViewColumn.One)

    const jsFilePath
			= Uri.joinPath(extensionContext.value!.extensionUri, 'views', 'target', 'assets', 'index.js')
    const cssFilePath
			= Uri.joinPath(extensionContext.value!.extensionUri, 'views', 'target', 'assets', 'index.css')

    const jsUrl = panel.webview.asWebviewUri(jsFilePath).toString()
    const cssUrl = panel.webview.asWebviewUri(cssFilePath).toString()

    const html = computed(() => `<!DOCTYPE html>
		<html lang="en" data-vscode-context='{"webviewSection": "editor", "preventDefaultContextMenuItems": true}'>
		  <head>
			<meta charset="UTF-8">
			<link rel="icon" href="/favicon.ico">
			
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Image Preview View</title>
			
			<script type="module" crossorigin src="${jsUrl}"></script>
			
			<link rel="stylesheet" href="${cssUrl}">
		  </head>
		  <body >
			<div id="app"></div>
		  </body>
		</html>`)

    const { postMessage } = useWebviewView(
      'images-preview',
      html,
      {
        webviewOptions: {
          enableScripts: true,
          enableCommandUris: true,
        },
        onDidReceiveMessage(ev) {
          logger.info(ev.type)

          if (ev.type === 'updateMessage')
            message.value = ev.message
        },
      },
    )

    return { message, postMessage }
  })()
}
