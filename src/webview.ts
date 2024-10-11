import { computed, createSingletonComposable, extensionContext, ref, watchEffect, useWebviewView, toValue } from 'reactive-vscode'
import { Uri } from 'vscode'
import { logger } from './utils'

// function getNonce() {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   for (let i = 0; i < 32; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// }

export const usePineConeWebviewView = createSingletonComposable(() => {
  const message = ref('')

  const { postMessage, view } = useWebviewView(
    '1_pineconeViews',
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
    console.log('view', view.value);
    
    if (view.value) {
      const jsFilePath
        = Uri.joinPath(extensionContext.value!.extensionUri, 'views', 'target', 'assets', 'index.js')
      const cssFilePath
        = Uri.joinPath(extensionContext.value!.extensionUri, 'views', 'target', 'assets', 'index.css')

      const jsUrl = view.value.webview.asWebviewUri(jsFilePath).toString()
      const cssUrl = view.value.webview.asWebviewUri(cssFilePath).toString()

      // Use a nonce to only allow specific scripts to be run
      // const nonce = getNonce();

      const html = computed(() => `<!DOCTYPE html>
        <html lang="en" data-vscode-context='{"webviewSection": "document","preventDefaultContextMenuItems": true}'>
          <head>
          <meta charset="UTF-8">
          <link rel="icon" href="/favicon.ico">

          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${view.value!.webview.cspSource}; img-src ${view.value!.webview.cspSource} https:; script-src ${view.value!.webview.cspSource};">
          
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
