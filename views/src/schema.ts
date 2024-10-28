import type { Faker } from '@faker-js/faker'
import { generateMock } from '@anatine/zod-mock'
// import { faker } from '@faker-js/faker'
import { z } from 'zod'

export type FakerFunction = () => string | number | boolean | Date

export const ImageListSchema = z.array(z.object({
  imageFileUri: z.string(),
  imageVsCodePath: z.string(),
  basename: z.string(),
  extname: z.string(),
}))

export function mockeryMapper(
  keyName: string,
  fakerInstance: Faker,
): FakerFunction | undefined {
  const keyToFnMap: Record<string, FakerFunction> = {
    imageFileUri: fakerInstance.image.avatar,
    imageVsCodePath: fakerInstance.image.avatar,
    basename: fakerInstance.string.alpha,
    extname: fakerInstance.string.alpha,
  }
  return keyName && keyName in keyToFnMap
    ? keyToFnMap[keyName as never]
    : undefined
}

export const imageListMock = generateMock(ImageListSchema, { mockeryMapper })
export type ImageListData = z.infer<typeof ImageListSchema>

// const imageMockUrl = faker.image.urlPicsumPhotos({ width: 300, height: 300, format: 'png' })
// const imageMockUrl = faker.image.avatar()
// const imageSplitList = new URL(imageMockUrl).pathname.split('/')
// const basename = imageSplitList[imageSplitList.length - 1]
// const extname = basename.split('.')[1]

// export const imageListMock = Array.from({ length: 20 }, () => ({
//   imageFileUri: imageMockUrl,
//   imageVsCodePath: imageMockUrl,
//   basename: imageSplitList[imageSplitList.length - 1],
//   extname,
// }))
