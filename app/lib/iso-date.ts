const isoDay = /^\d{4}-\d{2}-\d{2}$/
const isoMonth = /^\d{4}-\d{2}$/
const isoYear = /^\d{4}$/

export const toIsoDate = (value: string, bound: 'start' | 'end' = 'end') => {
  if (isoDay.test(value)) {
    return value
  }

  if (isoMonth.test(value)) {
    return `${value}-01`
  }

  if (isoYear.test(value)) {
    return bound === 'start' ? `${value}-01-01` : `${value}-12-31`
  }

  return value
}

export const latestIsoDate = (values: string[]) =>
  values.reduce<string | undefined>((latest, value) => {
    const date = toIsoDate(value)

    if (!latest || date > latest) {
      return date
    }

    return latest
  }, undefined)
