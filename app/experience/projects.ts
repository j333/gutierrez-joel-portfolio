export type ExperienceProject = {
  name: string
  role: string
  brand: string
  client: string
  industry: string
  startedAt: string
  endedAt: string
  group?: string
}

export type ExperienceProjectGroup = {
  name: string
  industry: string
  url?: string
  projects: ExperienceProject[]
}

const brandUrls: Record<string, string> = {
  AIG: 'https://www.aig.com',
  AMM: 'https://andrewmcmahon.com',
  'Various Projects, Inc.': 'https://various-projects.com',
  'Career Done Write': 'https://careersdonewrite.com',
  'Dear Jack Foundation': 'https://www.dearjackfoundation.org',
  Dimensions: 'https://centricdigital.com/data/',
  Dummies: 'https://www.dummies.com',
  Humana: 'https://www.humana.com',
  'J.D. Power': 'https://www.jdpower.com',
  'Kaiser Permanente': 'https://kaiserpermanente.org',
  'L Brands': 'https://www.lb.com',
  'Leukemia & Lymphoma Society': 'https://www.lls.org',
  Premo: 'https://premosocial.com',
  Tallo: 'https://tallo.com',
  TempraMed: 'https://tempramed.com',
  "Victoria's Secret": 'https://www.victoriassecret.com',
}

const centricDigitalProjects: ExperienceProject[] = [
  {
    name: 'Website 2021 Redesign and Shopify Migration',
    role: 'Senior Product Designer',
    brand: 'AMM',
    client: 'AMM',
    industry: 'Music',
    startedAt: '2021',
    endedAt: '2021',
  },
  {
    name: 'Website Redesign and Shopify Migration',
    role: 'Senior Product Designer',
    brand: 'TempraMed',
    client: 'TempraMed',
    industry: 'Healthcare',
    startedAt: '2021',
    endedAt: '2021',
  },
  {
    name: 'Webflow Migration',
    role: 'Senior Product Designer',
    brand: 'Various Projects, Inc.',
    client: 'Selected clients',
    industry: 'Art',
    startedAt: '2021',
    endedAt: '2021',
  },
  {
    name: 'Dashboard Design and Data Analysis',
    role: 'Lead Product Designer',
    brand: 'Tallo',
    client: 'Tallo',
    industry: 'Recruitment',
    startedAt: '2020',
    endedAt: '2020',
  },
  {
    name: 'Pink Bra Dashboard',
    role: 'Lead Product Designer',
    brand: "Victoria's Secret",
    client: 'L Brands',
    industry: 'Apparel',
    startedAt: '2019',
    endedAt: '2020',
    group: 'L Brands',
  },
  {
    name: 'Web App Platform',
    role: 'Senior Product Designer',
    brand: 'Dimensions',
    client: 'Centric Digital',
    industry: 'Digital Solutions',
    startedAt: '2018',
    endedAt: '2020',
  },
  {
    name: 'Wexner Patterning',
    role: 'UX/UI Designer',
    brand: 'L Brands',
    client: 'L Brands',
    industry: 'Cosmetics',
    startedAt: '2019',
    endedAt: '2019',
    group: 'L Brands',
  },
  {
    name: 'Website Redesign',
    role: 'UX/UI Designer',
    brand: 'Dummies',
    client: 'Wiley',
    industry: 'Education',
    startedAt: '2019',
    endedAt: '2019',
  },
  {
    name: 'International Code-a-thons',
    role: 'UX/UI Designer',
    brand: 'AIG',
    client: 'AIG',
    industry: 'Insurance',
    startedAt: '2015',
    endedAt: '2019',
  },
  {
    name: 'Institutional Website 2018',
    role: 'UX/UI Designer',
    brand: 'AMM',
    client: 'AMM',
    industry: 'Music',
    startedAt: '2018',
    endedAt: '2018',
  },
  {
    name: 'Branding',
    role: 'Brand Designer',
    brand: 'Premo',
    client: 'Premo',
    industry: 'Social Media',
    startedAt: '2018',
    endedAt: '2018',
  },
  {
    name: 'Web App Design and Product Management',
    role: 'UX/UI Designer',
    brand: 'Premo',
    client: 'Premo',
    industry: 'Social Media',
    startedAt: '2018',
    endedAt: '2018',
  },
  {
    name: 'Branding Redesign',
    role: 'Brand Designer',
    brand: 'Dummies',
    client: 'Wiley',
    industry: 'Education',
    startedAt: '2018',
    endedAt: '2018',
  },
  {
    name: 'Industry Reports',
    role: 'UX/UI Designer',
    brand: 'J.D. Power',
    client: 'J.D. Power',
    industry: 'Market Research',
    startedAt: '2018',
    endedAt: '2018',
  },
  {
    name: 'Website',
    role: 'UX/UI Designer',
    brand: 'Dear Jack Foundation',
    client: 'AMM',
    industry: 'Nonprofit',
    startedAt: '2017',
    endedAt: '2018',
  },
  {
    name: 'Mobile Apps Dashboard',
    role: 'UX/UI Designer',
    brand: 'Kaiser Permanente',
    client: 'Kaiser Permanente',
    industry: 'Healthcare',
    startedAt: '2017',
    endedAt: '2018',
  },
  {
    name: 'Various Design',
    role: 'UX/UI Designer',
    brand: 'Humana',
    client: 'Humana',
    industry: 'Healthcare',
    startedAt: '2014',
    endedAt: '2018',
  },
  {
    name: 'Institutional Website 2017 Redesign',
    role: 'UX/UI Designer',
    brand: 'AMM',
    client: 'AMM',
    industry: 'Music',
    startedAt: '2017',
    endedAt: '2017',
  },
  {
    name: 'Boutique Builder',
    role: 'UX/UI Designer',
    brand: "Victoria's Secret",
    client: 'L Brands',
    industry: 'Apparel',
    startedAt: '2017',
    endedAt: '2017',
    group: 'L Brands',
  },
  {
    name: 'Institutional Website 2016',
    role: 'UX/UI Designer',
    brand: 'AMM',
    client: 'AMM',
    industry: 'Music',
    startedAt: '2016',
    endedAt: '2016',
  },
  {
    name: 'Trends Dashboard',
    role: 'UX/UI Designer',
    brand: 'Kaiser Permanente',
    client: 'Kaiser Permanente',
    industry: 'Healthcare',
    startedAt: '2016',
    endedAt: '2016',
  },
  {
    name: 'Analytics',
    role: 'UX/UI Designer',
    brand: "Victoria's Secret",
    client: 'L Brands',
    industry: 'Apparel',
    startedAt: '2016',
    endedAt: '2016',
    group: 'L Brands',
  },
  {
    name: 'Last the Night Website',
    role: 'UX/UI Designer',
    brand: 'Leukemia & Lymphoma Society',
    client: 'Leukemia & Lymphoma Society',
    industry: 'Nonprofit',
    startedAt: '2016',
    endedAt: '2016',
  },
  {
    name: 'TNT Website',
    role: 'UX/UI Designer',
    brand: 'Leukemia & Lymphoma Society',
    client: 'Leukemia & Lymphoma Society',
    industry: 'Nonprofit',
    startedAt: '2016',
    endedAt: '2016',
  },
  {
    name: 'PDH Executive Visualization Dashboard',
    role: 'UX/UI Designer',
    brand: 'AIG',
    client: 'AIG',
    industry: 'Insurance',
    startedAt: '2015',
    endedAt: '2016',
  },
  {
    name: 'Active Care EWS (Japanese)',
    role: 'UX/UI Designer',
    brand: 'AIG',
    client: 'AIG',
    industry: 'Insurance',
    startedAt: '2015',
    endedAt: '2015',
  },
  {
    name: 'Joining KP Early Engagement',
    role: 'UX/UI Designer',
    brand: 'Kaiser Permanente',
    client: 'Kaiser Permanente',
    industry: 'Healthcare',
    startedAt: '2015',
    endedAt: '2015',
  },
  {
    name: 'CDS Progress Update',
    role: 'UX/UI Designer',
    brand: 'Kaiser Permanente',
    client: 'Kaiser Permanente',
    industry: 'Healthcare',
    startedAt: '2015',
    endedAt: '2015',
  },
  {
    name: 'Institutional Website',
    role: 'UX/UI Designer',
    brand: 'Career Done Write',
    client: 'Career Done Write',
    industry: 'Human Resources',
    startedAt: '2015',
    endedAt: '2015',
  },
  {
    name: 'Website 2014 Redesign',
    role: 'Junior UX/UI Designer',
    brand: 'AMM',
    client: 'AMM',
    industry: 'Music',
    startedAt: '2014',
    endedAt: '2014',
  },
  {
    name: 'Experiences',
    role: 'Junior UX/UI Designer',
    brand: 'Kaiser Permanente',
    client: 'Kaiser Permanente',
    industry: 'Healthcare',
    startedAt: '2014',
    endedAt: '2014',
  },
  {
    name: 'HEP Website',
    role: 'Junior Frontend Developer',
    brand: 'Kaiser Permanente',
    client: 'Kaiser Permanente',
    industry: 'Healthcare',
    startedAt: '2014',
    endedAt: '2014',
  },
  {
    name: 'Find Doctors and Locations',
    role: 'Junior UX/UI Designer',
    brand: 'Kaiser Permanente',
    client: 'Kaiser Permanente',
    industry: 'Healthcare',
    startedAt: '2014',
    endedAt: '2014',
  },
]

const experienceProjects: Record<string, ExperienceProject[]> = {
  'centric-digital': centricDigitalProjects,
}

const sortProjects = (projects: ExperienceProject[]) =>
  [...projects].sort((a, b) => {
    const byEnd = b.endedAt.localeCompare(a.endedAt)

    if (byEnd !== 0) {
      return byEnd
    }

    const byStart = b.startedAt.localeCompare(a.startedAt)

    if (byStart !== 0) {
      return byStart
    }

    return a.name.localeCompare(b.name, 'en')
  })

const groupExperienceProjects = (
  projects: ExperienceProject[]
): ExperienceProjectGroup[] => {
  const groups = new Map<string, ExperienceProject[]>()

  projects.forEach((project) => {
    const name = project.brand
    const existing = groups.get(name)

    if (existing) {
      existing.push(project)
      return
    }

    groups.set(name, [project])
  })

  return [...groups.entries()]
    .map(([name, items]) => {
      const industries = [...new Set(items.map((item) => item.industry))]

      return {
        name,
        industry: industries.join(', '),
        url: brandUrls[name],
        projects: sortProjects(items),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

export const getExperienceProjects = (slug: string) => {
  const projects = experienceProjects[slug]

  if (!projects?.length) {
    return []
  }

  return groupExperienceProjects(projects)
}

export const SELECTED_WORK_MARKER = '<!-- selected-work -->'

export const splitSelectedWork = (content: string) => {
  if (!content.includes(SELECTED_WORK_MARKER)) {
    return { before: content, after: null }
  }

  const [before, after] = content.split(SELECTED_WORK_MARKER)

  return {
    before: before.trim(),
    after: after.trim(),
  }
}
