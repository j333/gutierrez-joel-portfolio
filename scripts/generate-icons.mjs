import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const CIRCLE_RATIO = 10 / 32

const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n += 1) {
  let c = n
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crcTable[n] = c >>> 0
}

const crc32 = (buffer) => {
  let crc = 0xffffffff
  for (let i = 0; i < buffer.length; i += 1) {
    crc = crcTable[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

const pngChunk = (type, data) => {
  const typeBuffer = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crcInput = Buffer.concat([typeBuffer, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(crcInput))
  return Buffer.concat([length, typeBuffer, data, crc])
}

const sampleCount = (size) => {
  if (size <= 32) return 8
  if (size <= 192) return 4
  return 2
}

const circleCoverage = (x, y, size) => {
  const samples = sampleCount(size)
  const radius = size * CIRCLE_RATIO
  const radiusSquared = radius * radius
  const center = size / 2
  let inside = 0

  for (let sy = 0; sy < samples; sy += 1) {
    for (let sx = 0; sx < samples; sx += 1) {
      const px = x + (sx + 0.5) / samples
      const py = y + (sy + 0.5) / samples
      const dx = px - center
      const dy = py - center
      if (dx * dx + dy * dy <= radiusSquared) {
        inside += 1
      }
    }
  }

  return inside / (samples * samples)
}

const encodePng = (size) => {
  const stride = size * 4 + 1
  const raw = Buffer.alloc(stride * size)

  for (let y = 0; y < size; y += 1) {
    const rowStart = y * stride
    raw[rowStart] = 0
    for (let x = 0; x < size; x += 1) {
      const value = Math.round(circleCoverage(x, y, size) * 255)
      const i = rowStart + 1 + x * 4
      raw[i] = value
      raw[i + 1] = value
      raw[i + 2] = value
      raw[i + 3] = 255
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

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

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#000"/>
  <circle cx="16" cy="16" r="10" fill="#fff"/>
</svg>
`

const png16 = encodePng(16)
const png32 = encodePng(32)
const png180 = encodePng(180)
const png192 = encodePng(192)
const png512 = encodePng(512)

const files = [
  ['app/icon.svg', svg],
  ['app/favicon.ico', encodeIco([{ size: 16, data: png16 }, { size: 32, data: png32 }])],
  ['app/apple-icon.png', png180],
  ['public/icon-192.png', png192],
  ['public/icon-512.png', png512],
]

for (const [relativePath, contents] of files) {
  const absolutePath = join(root, relativePath)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
  console.log(`wrote ${relativePath}`)
}
