interface AdaptativeImageData {
  width: number
  height: number
  uri: string
  'uri@2x'?: string
  'uri@3x'?: string
}

class AdaptiveImage {
  protected data: AdaptativeImageData

  constructor(data: AdaptativeImageData) {
    this.data = data
  }

  get uri() {
    if (
      typeof window !== 'undefined' &&
      typeof window.devicePixelRatio !== 'undefined'
    ) {
      if (window.devicePixelRatio > 2 && this.data['uri@3x']) {
        return this.data['uri@3x']
      } else if (window.devicePixelRatio > 1 && this.data['uri@2x']) {
        return this.data['uri@2x']
      }
    }

    return this.data.uri
  }

  get width() {
    return this.data.width
  }

  get height() {
    return this.data.height
  }

  toString() {
    return this.uri
  }
}

export default AdaptiveImage
