'use client'
import Banners from '@/components/dashboard/Banners'
import { useSiteData } from '@/lib/dataContext'

export default function BannerPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <Banners data={siteData?.banners} />
    </div>
  )
}
