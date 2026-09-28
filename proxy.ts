import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  isLocale,
  legacyContentPath,
  localeCookieName,
  localePath,
  negotiateLocale,
  stripLocale,
} from 'app/lib/locale'

const resolveLocale = (request: NextRequest) => {
  const saved = request.cookies.get(localeCookieName)?.value

  if (isLocale(saved)) {
    return saved
  }

  return negotiateLocale(request.headers.get('accept-language'))
}

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]

  if (isLocale(first)) {
    const bare = stripLocale(pathname)
    const nextPath = legacyContentPath(bare)

    if (nextPath === bare) {
      return NextResponse.next()
    }

    const url = request.nextUrl.clone()
    url.pathname = localePath(first, nextPath)

    return NextResponse.redirect(url, 308)
  }

  const url = request.nextUrl.clone()
  url.pathname = localePath(resolveLocale(request), legacyContentPath(pathname))

  return NextResponse.redirect(url, 302)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|og(?:/|$)|md(?:/|$)|.*\\.(?:webp|avif|png|jpg|jpeg|gif|svg|ico|txt|xml|webmanifest)$).*)',
  ],
}
