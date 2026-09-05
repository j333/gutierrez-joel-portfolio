import Image from 'next/image'
import Link from 'next/link'
import { typeMetaClassName } from 'app/components/page-layout'
import {
  imagePlaceholderClassName,
  projectCardImageSizes,
} from 'app/lib/image-sizes'
import {
  getProjectImage,
  projectImageQuality,
  type Project,
} from 'app/projects/utils'

type ProjectHeading = 'h2' | 'h3'

type ProjectCardProps = {
  project: Project
  heading?: ProjectHeading
}

export const ProjectCard = ({
  project,
  heading: Heading = 'h2',
}: ProjectCardProps) => {
  const { title, product } = project.metadata
  const image = getProjectImage(project)
  const href = `/${project.slug}`
  const coverAlt = `${title} — ${product}`

  return (
    <article className="min-w-0">
      <Link
        href={href}
        className="group flex flex-col gap-1 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
      >
        {image ? (
          <div
            className={`aspect-video w-full overflow-hidden ${imagePlaceholderClassName}`}
          >
            <Image
              src={image.src}
              alt={coverAlt}
              width={image.width}
              height={image.height}
              sizes={projectCardImageSizes}
              quality={projectImageQuality}
              unoptimized
              className="h-full w-full rounded-none object-cover motion-safe:transition-transform motion-safe:duration-1000 motion-safe:ease-[cubic-bezier(0.65,0,0.35,1)] motion-safe:group-hover:scale-[1.07] motion-safe:group-focus-visible:scale-[1.07]"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className={`aspect-video w-full ${imagePlaceholderClassName}`}
          />
        )}
        <div className="flex items-baseline justify-between gap-4">
          <Heading className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
            {title}
          </Heading>
          <span className={typeMetaClassName}>{product}</span>
        </div>
      </Link>
    </article>
  )
}

export const projectGridClassName =
  'grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2'
