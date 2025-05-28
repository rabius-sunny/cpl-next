'use client'
import Footer from '@/components/dashboard/Footer'
import { useSiteData } from '@/lib/dataContext'

export default function FooterPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <Footer data={siteData?.footer} />
    </div>
  )
}
