'use client'
import Contact from '@/components/dashboard/Contact'
import { useSiteData } from '@/lib/dataContext'

export default function ContactPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <Contact data={siteData?.contact} />
    </div>
  )
}
