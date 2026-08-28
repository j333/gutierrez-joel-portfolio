import fs from 'fs'
import path from 'path'

export type PublicImageSize = {
  width: number
  height: number
}

const getWebpSize = (buffer: Buffer): PublicImageSize | null => {
  if (
    buffer.length < 30 ||
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return null
  }

  let offset = 12

  while (offset + 8 <= buffer.length) {
    const chunk = buffer.toString('ascii', offset, offset + 4)
    const chunkSize = buffer.readUInt32LE(offset + 4)
    const data = offset + 8

    if (chunk === 'VP8X' && data + 10 <= buffer.length) {
      const width =
        1 +
        (buffer[data + 4] | (buffer[data + 5] << 8) | (buffer[data + 6] << 16))
      const height =
        1 +
        (buffer[data + 7] | (buffer[data + 8] << 8) | (buffer[data + 9] << 16))
      return { width, height }
    }

    if (chunk === 'VP8 ' && data + 10 <= buffer.length) {
      const width = buffer.readUInt16LE(data + 6) & 0x3fff
      const height = buffer.readUInt16LE(data + 8) & 0x3fff
      return { width, height }
    }

    if (chunk === 'VP8L' && data + 5 <= buffer.length) {
      const bits = buffer.readUInt32LE(data + 1)
      const width = (bits & 0x3fff) + 1
      const height = ((bits >> 14) & 0x3fff) + 1
      return { width, height }
    }

    offset += 8 + chunkSize + (chunkSize % 2)
  }

  return null
}

export const getPublicImageSize = (src: string): PublicImageSize | null => {
  if (!src.startsWith('/') || src.includes('..')) {
    return null
  }

  const filePath = path.join(process.cwd(), 'public', src)

  if (!fs.existsSync(filePath)) {
    return null
  }

  return getWebpSize(fs.readFileSync(filePath))
}
