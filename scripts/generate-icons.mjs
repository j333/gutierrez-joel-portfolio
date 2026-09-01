import { mkdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'public/icon-512.png')

const encodeIco = (images) => {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  const entries = []
  const payloads = []
  let offset = 6 + 16 * images.length

  for (const image of images) {
    const entry = Buffer.alloc(16)
    entry[0] = image.size >= 256 ? 0 : image.size
    entry[1] = image.size >= 256 ? 0 : image.size
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(image.data.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    payloads.push(image.data)
    offset += image.data.length
  }

  return Buffer.concat([header, ...entries, ...payloads])
}

const resizePng = (size) =>
  sharp(source)
    .ensureAlpha()
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toBuffer()

const png16 = await resizePng(16)
const png32 = await resizePng(32)
const png180 = await resizePng(180)
const png192 = await resizePng(192)

const files = [
  ['app/icon.png', png192],
  ['app/favicon.ico', encodeIco([{ size: 16, data: png16 }, { size: 32, data: png32 }])],
  ['app/apple-icon.png', png180],
  ['public/icon-192.png', png192],
]

for (const [relativePath, contents] of files) {
  const absolutePath = join(root, relativePath)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
  console.log(`wrote ${relativePath}`)
}

try {
  unlinkSync(join(root, 'app/icon.svg'))
  console.log('removed app/icon.svg')
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error
  }
}
