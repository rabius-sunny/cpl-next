'use client'
import Projects from '@/components/dashboard/Projects'
import { useSiteData } from '@/lib/dataContext'

export default function ProjectsPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <Projects data={siteData?.projects} />
    </div>
  )
}
