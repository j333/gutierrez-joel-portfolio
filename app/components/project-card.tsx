import Link from 'next/link'
import { GlitchCover } from 'app/components/glitch-cover'
import { typeMetaClassName } from 'app/components/page-layout'
import { groupHoverTextClassName } from 'app/components/link-styles'
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
        className="group flex flex-col gap-3 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
      >
        {image ? (
          <GlitchCover
            src={image.src}
            alt={coverAlt}
            width={image.width}
            height={image.height}
            sizes={projectCardImageSizes}
            quality={projectImageQuality}
          />
        ) : (
          <div
            aria-hidden="true"
            className={`aspect-video w-full ${imagePlaceholderClassName}`}
          />
        )}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <Heading className={`${typeMetaClassName} ${groupHoverTextClassName}`}>
            {title}
          </Heading>
          <span aria-hidden="true" className={typeMetaClassName}>
            ·
          </span>
          <span className={typeMetaClassName}>{product}</span>
        </div>
      </Link>
    </article>
  )
}

export const projectGridClassName =
  'grid min-w-0 grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2'
