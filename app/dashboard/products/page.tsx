'use client'
import Products from '@/components/dashboard/Products'
import { useSiteData } from '@/lib/dataContext'

export default function ProductsPage() {
  const { siteData } = useSiteData()
  return (
    <div>
      <Products data={siteData?.products} />
    </div>
  )
}
