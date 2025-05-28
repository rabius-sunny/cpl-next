'use client'
import Logo from '@/components/dashboard/Logo'
import { useSiteData } from '@/lib/dataContext'

export default function LogoPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <Logo data={siteData?.logo} />
    </div>
  )
}
