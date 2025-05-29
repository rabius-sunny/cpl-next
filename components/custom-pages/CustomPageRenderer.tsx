'use client'

import { useMemo } from 'react'
import BottomMediaSection from './sections/BottomMediaSection'
import ContentSection from './sections/ContentSection'
import GridLayoutSection from './sections/GridLayoutSection'
import HeaderBannerSection from './sections/HeaderBannerSection'
import ImageTextSection from './sections/ImageTextSection'

interface CustomPageRendererProps {
  page: CustomPage
}

export default function CustomPageRenderer({ page }: CustomPageRendererProps) {
  // Sort sections by order
  const sortedSections = useMemo(() => {
    return [...page.sections].sort((a, b) => a.order - b.order)
  }, [page.sections])

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'header-banner':
        return <HeaderBannerSection key={section.id} data={section.data} />
      case 'content-section':
        return <ContentSection key={section.id} data={section.data} />
      case 'grid-layout':
        return <GridLayoutSection key={section.id} data={section.data} />
      case 'image-text':
        return <ImageTextSection key={section.id} data={section.data} />
      case 'bottom-media':
        return <BottomMediaSection key={section.id} data={section.data} />
      default:
        console.warn(`Unknown section type: ${section.type}`)
        return null
    }
  }

  return (
    <div className='min-h-screen'>
      {/* Page Title - Optional, uncomment if you want to display the page title */}
      {/* <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
        </div>
      </div> */}

      {/* Render sections */}
      <div className='space-y-0'>{sortedSections.map(renderSection)}</div>
    </div>
  )
}
