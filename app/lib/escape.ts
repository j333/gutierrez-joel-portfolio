export const toJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c')
