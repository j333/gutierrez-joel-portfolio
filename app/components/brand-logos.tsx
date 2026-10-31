import { Fragment } from 'react'
import Image from 'next/image'
import { homeBrands } from 'app/lib/home-data'
import { cx } from 'app/lib/cx'

type BrandLogosProps = {
  className?: string
}

// Eight marks. Breaks keep each row the same length:
// 2 per row under 26rem, 4 per row under 54rem, then one row.
const rowBreakClassName = (index: number, count: number) => {
  const position = index + 1

  if (position === count || position % 2 !== 0) return null

  if (position % 4 === 0) {
    return 'h-8 w-full shrink-0 basis-full @[54rem]:hidden'
  }

  return 'h-8 w-full shrink-0 basis-full @[26rem]:hidden'
}

export const BrandLogos = ({ className }: BrandLogosProps) => {
  const count = homeBrands.length

  return (
    <div className={cx('@container w-full', className)}>
      <ul className="flex w-full flex-wrap items-center justify-between py-4 @[54rem]:flex-nowrap">
        {homeBrands.map((brand, index) => {
          const breakClassName = rowBreakClassName(index, count)

          return (
            <Fragment key={brand.name}>
              <li
                className="flex shrink-0 items-center justify-center"
                style={{ width: brand.markWidth, height: brand.markHeight }}
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={brand.width}
                  height={brand.height}
                  className="h-full w-full object-contain dark:invert"
                />
              </li>
              {breakClassName ? (
                <li aria-hidden="true" className={breakClassName} />
              ) : null}
            </Fragment>
          )
        })}
      </ul>
    </div>
  )
}
