import { mkdir } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import sharp from 'sharp'

const DEFAULT_MAX = 1600

const usage = () => {
  console.error(
    'Usage: node scripts/optimize-image.mjs <input> <output.webp> [--max 1600|1920]'
  )
  process.exit(1)
}

const args = process.argv.slice(2)
let maxWidth = DEFAULT_MAX
const positional = []

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]

  if (arg === '--max') {
    maxWidth = Number.parseInt(args[i + 1] ?? '', 10)
    i += 1
    continue
  }

  if (arg.startsWith('--')) {
    usage()
  }

  positional.push(arg)
}

const [inputArg, outputArg] = positional

if (!inputArg || !outputArg || !Number.isFinite(maxWidth) || maxWidth < 1) {
  usage()
}

if (extname(outputArg).toLowerCase() !== '.webp') {
  console.error('Output must be a .webp file')
  process.exit(1)
}

const input = resolve(inputArg)
const output = resolve(outputArg)

await mkdir(dirname(output), { recursive: true })

await sharp(input)
  .resize({
    width: maxWidth,
    withoutEnlargement: true,
  })
  .webp({ quality: 90 })
  .toFile(output)

const result = await sharp(output).metadata()
console.log(
  `wrote ${outputArg} (${result.width}×${result.height} WebP, max ${maxWidth}px)`
)
