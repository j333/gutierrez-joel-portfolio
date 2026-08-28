export const preventWidow = (text: string) => {
  const lastSpace = text.lastIndexOf(' ')

  if (lastSpace === -1) {
    return text
  }

  return `${text.slice(0, lastSpace)}\u00A0${text.slice(lastSpace + 1)}`
}
