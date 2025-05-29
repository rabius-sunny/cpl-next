'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Grid3X3, ImageIcon, Layout, Video } from 'lucide-react'

interface SectionButtonsProps {
  onAddSection: (type: PageSection['type']) => void
}

export default function SectionButtons({ onAddSection }: SectionButtonsProps) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Add Section</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Button
          variant='outline'
          className='w-full justify-start'
          onClick={() => onAddSection('header-banner')}
        >
          <Layout className='h-4 w-4 mr-2' />
          Header Banner
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start'
          onClick={() => onAddSection('content-section')}
        >
          <FileText className='h-4 w-4 mr-2' />
          Content Section
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start'
          onClick={() => onAddSection('grid-layout')}
        >
          <Grid3X3 className='h-4 w-4 mr-2' />
          Grid Layout
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start'
          onClick={() => onAddSection('image-text')}
        >
          <ImageIcon className='h-4 w-4 mr-2' />
          Image & Text
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start'
          onClick={() => onAddSection('bottom-media')}
        >
          <Video className='h-4 w-4 mr-2' />
          Bottom Media
        </Button>
      </CardContent>
    </Card>
  )
}
