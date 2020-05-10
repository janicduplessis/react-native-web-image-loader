import fs from 'fs'
import loaderUtils from 'loader-utils'
import path from 'path'
import validateSchema from 'schema-utils'
import { promisify } from 'util'
import { loader } from 'webpack'
import ImageSizeResolver from './modules/imageSizeResolver'
import { createImageWrapper, ScaledSourceImages } from './modules/imageWrapper'
import resolveScaledImages from './modules/scaledImageResolver'
import schema from './options'

const readFileAsync = promisify(fs.readFile)

const DEFAULT_IMAGE_CLASS_PATH = require.resolve('./modules/adaptiveImage')
const DEFAULT_IMAGE_NAME_FORMAT = '[hash].[ext]'
const DEFAULT_SCALINGS = { '@2x': 2, '@3x': 3 }

export default async function resolve(
  this: loader.LoaderContext,
  content: Buffer
) {
  const callback = this.async()
  // if (this.cacheable) this.cacheable() // TODO

  const options = loaderUtils.getOptions(this)

  validateSchema(schema, options, {
    name: 'React Native Web Image Loader',
    baseDataPath: 'options',
  })

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true
  const nameFormat = options.name || DEFAULT_IMAGE_NAME_FORMAT
  const scalings = options.scalings || DEFAULT_SCALINGS
  const size = ImageSizeResolver(this.resourcePath)
  const wrapImage = createImageWrapper(
    loaderUtils.stringifyRequest(
      this,
      options.imageClassPath || DEFAULT_IMAGE_CLASS_PATH
    ),
    esModule
  )
  const url = loaderUtils.interpolateName(this, nameFormat, {
    context: this.context,
    content,
  })

  let outputPath = url
  if (options.outputPath) {
    outputPath = path.posix.join(options.outputPath, url)
  }

  const imgUrls: { [key: string]: { url: string; outputPath: string } } = {
    '@1x': { url, outputPath },
  }

  this.emitFile(outputPath, content, null)

  try {
    const resolvedFiles = await resolveScaledImages(this.resourcePath, scalings)

    await Promise.all(
      Object.keys(resolvedFiles).map(async (key) => {
        const fileContent = await readFileAsync(resolvedFiles[key])
        const fileName = loaderUtils.interpolateName(this, nameFormat, {
          context: this.context,
          content: fileContent,
        })

        let outputPath = fileName
        if (options.outputPath) {
          outputPath = path.posix.join(options.outputPath, fileName)
        }

        this.emitFile(outputPath, fileContent, null)
        imgUrls[`@${scalings[key]}x`] = { url: fileName, outputPath }
      })
    )
  } catch (e) {
    console.error(e)
  }

  const publicImagePaths: { [key: string]: string } = {}

  for (const key in imgUrls) {
    const { url, outputPath } = imgUrls[key]
    let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`
    if (options.publicPath) {
      if (typeof options.publicPath === 'function') {
        publicPath = options.publicPath(url, this.resourcePath)
      } else {
        publicPath = `${
          options.publicPath.endsWith('/')
            ? options.publicPath
            : `${options.publicPath}/`
        }${url}`
      }

      publicPath = JSON.stringify(publicPath)
    }

    publicImagePaths[key] = publicPath
  }

  const result = wrapImage(size, publicImagePaths as ScaledSourceImages)

  callback!(null, result)
}

export const raw = true
