import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const fontsDirectory = join(process.cwd(), 'app/og/fonts')

const ibmPlexSansRegular = await readFile(
  join(fontsDirectory, 'IBMPlexSans-Regular.ttf')
)
const ibmPlexSansSemiBold = await readFile(
  join(fontsDirectory, 'IBMPlexSans-SemiBold.ttf')
)
const ibmPlexMonoRegular = await readFile(
  join(fontsDirectory, 'IBMPlexMono-Regular.ttf')
)

export const ogFonts = [
  {
    name: 'IBM Plex Sans',
    data: ibmPlexSansRegular,
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'IBM Plex Sans',
    data: ibmPlexSansSemiBold,
    weight: 600 as const,
    style: 'normal' as const,
  },
  {
    name: 'IBM Plex Mono',
    data: ibmPlexMonoRegular,
    weight: 400 as const,
    style: 'normal' as const,
  },
]
