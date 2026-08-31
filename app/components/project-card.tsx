import Image from 'next/image'
import Link from 'next/link'
import { YearRange } from './year-range'
import { projectCardImageSizes } from 'app/lib/layout'
import {
  getProjectImage,
  projectImageQuality,
  type Project,
} from 'app/projects/utils'

type ProjectCardProps = {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, startedAt, endedAt } = project.metadata
  const image = getProjectImage(project)
  const href = `/${project.slug}`

  return (
    <article className="min-w-0">
      <Link
        href={href}
        className="group flex flex-col gap-1 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
      >
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes={projectCardImageSizes}
            quality={projectImageQuality}
            unoptimized
            className="aspect-video h-auto w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="aspect-video w-full bg-neutral-100 dark:bg-neutral-900"
          />
        )}
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-medium leading-6 text-neutral-900 group-hover:underline group-focus-visible:underline dark:text-neutral-100">
            {title}
          </h2>
          <YearRange start={startedAt} end={endedAt} />
        </div>
      </Link>
    </article>
  )
}

export const projectGridClassName =
  'grid min-w-0 grid-cols-1 gap-x-4 gap-y-6 pb-16 lg:grid-cols-2'
