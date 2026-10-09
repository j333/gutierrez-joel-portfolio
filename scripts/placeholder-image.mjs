import { mkdir } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import sharp from 'sharp'

const usage = () => {
  console.error(
    'Usage: node scripts/placeholder-image.mjs <output.webp> --label "Brief editor" --size 1920x1080'
  )
  process.exit(1)
}

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const args = process.argv.slice(2)
let label = ''
let size = ''
const positional = []

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]

  if (arg === '--label') {
    label = args[i + 1] ?? ''
    i += 1
    continue
  }

  if (arg === '--size') {
    size = args[i + 1] ?? ''
    i += 1
    continue
  }

  if (arg.startsWith('--')) {
    usage()
  }

  positional.push(arg)
}

const [outputArg] = positional
const [width, height] = size.split('x').map((part) => Number.parseInt(part, 10))

if (
  !outputArg ||
  !label.trim() ||
  !Number.isFinite(width) ||
  !Number.isFinite(height) ||
  width < 1 ||
  height < 1 ||
  width > 1920
) {
  usage()
}

if (extname(outputArg).toLowerCase() !== '.webp') {
  console.error('Output must be a .webp file')
  process.exit(1)
}

const output = resolve(outputArg)
const isPhone = height > width
const fontSize = Math.round(Math.min(width, height) * (isPhone ? 0.045 : 0.032))
const eyebrowSize = Math.round(fontSize * 0.55)
const safeLabel = escapeXml(label.trim())

const landscape = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f5f5f5"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#e5e5e5" stroke-width="2"/>
  <text x="50%" y="46%" text-anchor="middle" fill="#a3a3a3" font-family="ui-monospace, monospace" font-size="${eyebrowSize}" letter-spacing="4">PLACEHOLDER</text>
  <text x="50%" y="54%" text-anchor="middle" fill="#737373" font-family="ui-monospace, monospace" font-size="${fontSize}">${safeLabel}</text>
</svg>`

const phoneWidth = Math.round(width * 0.42)
const phoneHeight = Math.round(height * 0.78)
const phoneX = Math.round((width - phoneWidth) / 2)
const phoneY = Math.round((height - phoneHeight) / 2)
const radius = Math.round(phoneWidth * 0.08)

const phone = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f5f5f5"/>
  <rect x="${phoneX}" y="${phoneY}" width="${phoneWidth}" height="${phoneHeight}" rx="${radius}" fill="#ffffff" stroke="#e5e5e5" stroke-width="2"/>
  <rect x="${phoneX + phoneWidth / 2 - phoneWidth * 0.12}" y="${phoneY + 28}" width="${phoneWidth * 0.24}" height="10" rx="5" fill="#e5e5e5"/>
  <text x="50%" y="48%" text-anchor="middle" fill="#a3a3a3" font-family="ui-monospace, monospace" font-size="${eyebrowSize}" letter-spacing="3">PLACEHOLDER</text>
  <text x="50%" y="54%" text-anchor="middle" fill="#737373" font-family="ui-monospace, monospace" font-size="${fontSize}">${safeLabel}</text>
</svg>`

await mkdir(dirname(output), { recursive: true })
await sharp(Buffer.from(isPhone ? phone : landscape))
  .webp({ quality: 80 })
  .toFile(output)

console.log(`${width}x${height} ${isPhone ? 'phone' : 'wide'} ${output}`)
