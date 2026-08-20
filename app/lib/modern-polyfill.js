// Replaces Next.js polyfill-module. Chrome/Edge/Firefox 111 and Safari 16.4
// already implement the ES2019–ES2022 methods Lighthouse flags (~14 KiB).
// Keep URL.canParse for Safari 16.4 (native from Safari 17).
if (!('canParse' in URL)) {
  URL.canParse = (url, base) => {
    try {
      return !!new URL(url, base)
    } catch {
      return false
    }
  }
}
