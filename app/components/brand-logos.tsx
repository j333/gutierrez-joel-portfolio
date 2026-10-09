import Image from 'next/image'
import {
  metaLabelClassName,
  sectionTitleClassName,
} from 'app/components/page-layout'
import { homeBrands } from 'app/lib/home-data'
import { cx } from 'app/lib/cx'

type BrandLogosProps = {
  label: string
  years: string
  className?: string
}

export const BrandLogos = ({ label, years, className }: BrandLogosProps) => {
  return (
    <section className={cx('flex w-full flex-col gap-6', className)}>
      <div className="flex w-full items-center justify-between gap-4">
        <h2 className={sectionTitleClassName}>{label}</h2>
        <p className={metaLabelClassName}>{years}</p>
      </div>
      <ul className="grid w-full grid-cols-2 border-t border-l border-neutral-200 sm:grid-cols-4 dark:border-neutral-800">
        {homeBrands.map((brand) => (
          <li
            key={brand.name}
            className="flex h-20 items-center justify-center border-r border-b border-neutral-200 px-6 sm:h-24 dark:border-neutral-800"
          >
            <Image
              src={brand.src}
              alt={brand.name}
              width={brand.width}
              height={brand.height}
              className="h-auto max-h-8 w-auto max-w-[128px] object-contain dark:invert"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
