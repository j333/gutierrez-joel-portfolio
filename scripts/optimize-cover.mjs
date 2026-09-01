import { mkdir } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import sharp from 'sharp'

const COVER_WIDTH = 1920
const COVER_HEIGHT = 1080

const usage = () => {
  console.error(
    'Usage: node scripts/optimize-cover.mjs <input> <output.webp>'
  )
  process.exit(1)
}

const [inputArg, outputArg] = process.argv.slice(2)

if (!inputArg || !outputArg) {
  usage()
}

if (extname(outputArg).toLowerCase() !== '.webp') {
  console.error('Output must be a .webp file')
  process.exit(1)
}

const input = resolve(inputArg)
const output = resolve(outputArg)

const metadata = await sharp(input).metadata()
const width = metadata.width ?? 0
const height = metadata.height ?? 0

if (width < COVER_WIDTH || height < COVER_HEIGHT) {
  console.error(
    `Cover source is ${width}×${height}. Need at least ${COVER_WIDTH}×${COVER_HEIGHT} (do not upscale).`
  )
  process.exit(1)
}

await mkdir(dirname(output), { recursive: true })

await sharp(input)
  .resize(COVER_WIDTH, COVER_HEIGHT, {
    fit: 'cover',
    position: 'centre',
    withoutEnlargement: true,
  })
  .webp({ quality: 90 })
  .toFile(output)

console.log(`wrote ${outputArg} (${COVER_WIDTH}×${COVER_HEIGHT} WebP)`)
