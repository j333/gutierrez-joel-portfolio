import Image from 'next/image'
import Link from 'next/link'
import {
  imagePlaceholderClassName,
  projectCardImageSizes,
} from 'app/lib/image-sizes'
import {
  getProjectImage,
  projectImageQuality,
  type Project,
} from 'app/projects/utils'

const cardMetaClassName =
  'font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400'

type ProjectCardProps = {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
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
              className="h-full w-full rounded-none object-cover"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className={`aspect-video w-full ${imagePlaceholderClassName}`}
          />
        )}
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-medium leading-6 text-neutral-900 group-hover:underline group-focus-visible:underline dark:text-neutral-100">
            {title}
          </h2>
          <span className={cardMetaClassName}>{product}</span>
        </div>
      </Link>
    </article>
  )
}

export const projectGridClassName =
  'grid min-w-0 grid-cols-1 gap-6 pb-16 lg:grid-cols-2'
