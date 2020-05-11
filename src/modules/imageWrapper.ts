import groupBy from 'lodash/groupBy'
import { WebpackResolvedImage } from '../Types'

export function createImageWrapper(classPath: string, esModule = false) {
  return (
    size: { width: number; height: number },
    images: WebpackResolvedImage[]
  ): string => {
    const imagesByType = groupBy(images, (img) => img.type)
    // Template strings are a bit weird here but this is the price
    // to pay to make the generated code beautiful :S
    const sources = `[
    ${Object.values(imagesByType)
      .map(
        (images) => `{
      srcSet: ${images
        .map((img) => `${img.publicPath} + " ${img.scale}x"`)
        .join(` + "," +\n        `)},
      type: "${images[0].type}"
    }`
      )
      .join(',\n    ')}
  ]`

    return `${
      esModule
        ? `import {AdaptiveImage} from ${classPath}`
        : `var AdaptiveImage = require(${classPath}).AdaptiveImage`
    };

${esModule ? 'export default' : 'module.exports ='} new AdaptiveImage({
  uri: ${images[0].publicPath},
  width: ${size.width},
  height: ${size.height},
  sources: ${sources}
});
`
  }
}
