import { Geist_Mono } from 'next/font/google'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-geist-mono',
})

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={`${geistMono.variable} contents`}>{children}</div>
}
