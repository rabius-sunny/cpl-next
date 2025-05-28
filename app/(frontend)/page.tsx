'use client'
import { AboutSection, ServiceSection } from '@/components/homepage'
import Clients from '@/components/homepage/clients'
import ContactSection from '@/components/homepage/contact'
import MainBanner from '@/components/homepage/main-banner'
import Products from '@/components/homepage/products'
import Projects from '@/components/homepage/projects'
import { useSiteData } from '@/lib/dataContext'

export default function HomePage() {
  const { siteData } = useSiteData()

  return (
    <>
      <MainBanner data={siteData?.banners} />
      <Products data={siteData?.products} />
      <AboutSection data={siteData?.about} />
      <ServiceSection data={siteData?.services} />
      <Projects data={siteData?.projects} />
      <Clients data={siteData?.clients} />
      <ContactSection data={siteData?.contact} />
    </>
  )
}
