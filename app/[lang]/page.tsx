import { HomeLanding } from 'app/components/home-landing'
import { getDictionary, getLocale } from 'app/lib/i18n'
import { getWritingPosts } from 'app/notes/utils'
import { getListedProjects } from 'app/projects/utils'

export const dynamic = 'force-static'

const Page = async () => {
  const locale = await getLocale()
  const copy = await getDictionary()
  const projects = getListedProjects(locale)
  const notes = getWritingPosts(locale)

  return (
    <HomeLanding
      locale={locale}
      copy={copy}
      projects={projects}
      notes={notes}
    />
  )
}

export default Page
