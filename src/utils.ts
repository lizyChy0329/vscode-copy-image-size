import { fileURLToPath } from 'node:url'
import { basename, join, normalize, parse, extname } from 'node:path'
import { lstatSync, readdirSync } from 'node:fs'
import { defineLogger } from 'reactive-vscode'
import { imageSize } from 'image-size'
import { Uri, Webview } from 'vscode'
import to from 'await-to-js'

export const logger = defineLogger('Copy Image Size')

type T0 = typeof imageSize
type OverloadedReturnType<T> =
    T extends { (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R } ? R :
      T extends { (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R } ? R :
        T extends { (...args: any[]): infer R, (...args: any[]): infer R } ? R :
          T extends (...args: any[]) => infer R ? R : any
type T1 = OverloadedReturnType<T0>

/**
 * Description placeholder
 *
 * @async
 * @param {URI} uri
 * @returns {Promise<T1 | undefined | null | void>}
 */
export async function toResolveURI(uri: Uri): Promise<T1 | undefined | null | void> {
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

/**
 * 获取选中文件,或文件夹下的文件
 * @param dUri
//  * @param depth
//  * @param currentDepth
 */
export async function resolveImages(dUri: Uri, webview: Webview): Promise<{
  imageFileUri: Uri
  imageVsCodePath: string
  basename: string
  extname: string
}[]> {
  const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff','.svg']
  // const EXCLUDE_DIR = ['node_modules']

  const dataList = [];
  // 检查当前深度是否超过限制
  // if (currentDepth > depth) {
  //   return filePaths
  // }

  const files = readdirSync(dUri.fsPath)

  for (const file of files) {
    const filePath = normalize(join(dUri.fsPath, `${file}`))
    const fileStat = lstatSync(filePath)

    if (fileStat.isDirectory()) {
      continue
    }

    // 检查文件扩展名是否是图片格式
    const extension = parse(filePath)?.ext?.toLowerCase()
    if (IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
      dataList.push({
        imageFileUri: Uri.file(filePath),
        imageVsCodePath: webview.asWebviewUri(Uri.file(filePath)).toString(),
        basename: basename(filePath),
        extname: extname(filePath)
      })
    }

  }
  
  return Promise.resolve(dataList)
}
