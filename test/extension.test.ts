import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import * as vscode from 'vscode'
import { URI } from 'vscode-uri'

vi.mock('vscode')

export function sum(a: number, b: number) {
  return a + b
}

const testImagePath = path.resolve(__dirname, 'src/assets/103976180.jpg')
// 假设这是您要测试的命令
const commandId = 'copy-image-size.copyImageExt'

describe('vscode-copy-image-size Command Tests', () => {
  it('should execute the command successfully', async () => {
    const result = await vscode.commands.executeCommand(commandId, URI.file(testImagePath))
    expect(result).toMatchSnapshot()
  })

  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
