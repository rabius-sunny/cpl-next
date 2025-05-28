'use client'
import About from '@/components/dashboard/About'
import { useSiteData } from '@/lib/dataContext'

export default function AboutPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <About data={siteData?.about} />
    </div>
  )
}
