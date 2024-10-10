import type { Ref } from 'reactive-vscode'
import { computed, createSingletonComposable, extensionContext, ref, watchEffect, useWebviewView, toValue } from 'reactive-vscode'
import { Uri } from 'vscode'
import { logger } from './utils'

export const usePineConeWebviewView = createSingletonComposable(() => {
  const message = ref('')

  const { postMessage, view } = useWebviewView(
    'pinecone',
    ref(''),
    {
      retainContextWhenHidden: true,
      webviewOptions: {
        enableScripts: true
        // enableCommandUris: true,
      },
      onDidReceiveMessage(ev) {
        logger.info(ev.type)

        if (ev.type === 'updateMessage')
          message.value = ev.message
      },
    },
  )

  watchEffect(() => {
    if (view.value) {
      const jsFilePath
        = Uri.joinPath(extensionContext.value!.extensionUri, 'views', 'target', 'assets', 'index.js')
      const cssFilePath
        = Uri.joinPath(extensionContext.value!.extensionUri, 'views', 'target', 'assets', 'index.css')

      const jsUrl = view.value.webview.asWebviewUri(jsFilePath).toString()
      const cssUrl = view.value.webview.asWebviewUri(cssFilePath).toString()

      const html = computed(() => `<!DOCTYPE html>
        <html lang="en" data-vscode-context='{"webviewSection": "document","preventDefaultContextMenuItems": true}'>
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

      view.value.webview.html = `${toValue(html)}`
    }
  })

  return { message, postMessage, view }
})
