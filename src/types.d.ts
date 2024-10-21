import type { Uri } from 'vscode'

export type WebviewContext = {
  preventDefaultContextMenuItems: boolean;
  webview: string;
  webviewSection: string;
  selectedUri?: Uri;
}

export type MaybeUriOrWebviewContext = Uri | WebviewContext;