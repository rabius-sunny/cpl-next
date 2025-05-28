'use client'
import Clients from '@/components/dashboard/Clients'
import { useSiteData } from '@/lib/dataContext'

export default function ClientsPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <Clients data={siteData?.clients} />
    </div>
  )
}
