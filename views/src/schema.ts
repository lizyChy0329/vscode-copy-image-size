import { faker } from '@faker-js/faker'
import { z } from 'zod'

export const ImageListSchema = z.array(z.object({
  imageFileUri: z.string(),
  imageVsCodePath: z.string(),
  basename: z.string(),
  extname: z.string(),
}))

export type ImageListData = z.infer<typeof ImageListSchema>

// const imageMockUrl = faker.image.urlPicsumPhotos({ width: 300, height: 300, format: 'png' })
const imageMockUrl = faker.image.avatar()
const imageSplitList = new URL(imageMockUrl).pathname.split('/')
const basename = imageSplitList[imageSplitList.length - 1]
const extname = basename.split('.')[1]

export const imageListMock = Array.from({ length: 20 }, () => ({
  imageFileUri: imageMockUrl,
  imageVsCodePath: imageMockUrl,
  basename: imageSplitList[imageSplitList.length - 1],
  extname,
}))
