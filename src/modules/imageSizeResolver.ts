import { imageSize } from 'image-size'

interface Size {
  width: number
  height: number
}

export default function (path: string): Size {
  return imageSize(path) as Size
}
