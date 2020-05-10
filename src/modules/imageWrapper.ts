export type ScaledSourceImages = {
  [key: string]: string
}

export const createImageWrapper = (classPath: string, esModule = false) => (
  size: { width: number; height: number },
  images: ScaledSourceImages
) => {
  const uri = `${images['@1x']}`

  delete images['@1x']

  const scalings: string[] = []

  for (const scaling in images) {
    scalings.push(`"uri${scaling}": ${images[scaling]},`)
  }

  return `${
    esModule
      ? `import AdaptiveImage from ${classPath}`
      : `var AdaptiveImage = require(${classPath}).default`
  };

${esModule ? 'export default' : 'module.exports ='} new AdaptiveImage({
    uri: ${uri},${scalings.join('')}
    width: ${size.width},
    height: ${size.height}
});`
}
