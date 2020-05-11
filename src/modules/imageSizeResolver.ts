import { imageSize as baseImageSize } from 'image-size'

interface Size {
  width: number
  height: number
}

export function imageSize(path: string, scale: number): Size {
  const size = baseImageSize(path) as Size
  if (scale !== 1) {
    return { width: size.width / scale, height: size.height / scale }
  } else {
    return size
  }
}
