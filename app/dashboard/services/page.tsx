'use client'

import Services from '@/components/dashboard/Services'
import { useSiteData } from '@/lib/dataContext'

export default function ServicesPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <Services data={siteData?.services} />
    </div>
  )
}
