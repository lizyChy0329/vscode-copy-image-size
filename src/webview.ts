import { lstatSync, readdirSync } from 'node:fs'
import { join, normalize, parse } from 'node:path'
import type { Ref } from 'reactive-vscode'
import { computed, createSingletonComposable, ref, useWebviewView } from 'reactive-vscode'
import { URI } from 'vscode-uri'
import { window } from 'vscode'
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
    const html = computed(() => `
      <script>
        vscode = acquireVsCodeApi()
        function updateMessage() {
          vscode.postMessage({
            type: 'updateMessage',
            message: document.querySelector('input').value,
          })
        }
      </script>
      <p>${message.value}</p>
      <p>${images}</p>
      <div style="display:flex; flex-wrap:wrap;">
        <input type="text" placeholder="Input Message" />
        <button onclick="updateMessage()">Update Message</button>
      </div>
    `)

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
