'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Grid3X3, GripVertical, ImageIcon, Layout, Plus, Video } from 'lucide-react'
import { DragData } from '../hooks/useDragAndDrop'

interface SectionButtonsProps {
  onAddSection: (type: PageSection['type']) => void
  isDragging?: boolean
}

interface SectionType {
  type: PageSection['type']
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
  iconBg: string
}

const sectionTypes: SectionType[] = [
  {
    type: 'header-banner',
    title: 'Header Banner',
    description: 'Eye-catching hero section with title, subtitle and background image',
    icon: <Layout className='h-6 w-6' />,
    gradient: 'from-blue-500 to-purple-600',
    iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
  },
  {
    type: 'content-section',
    title: 'Content Section',
    description: 'Rich text content with customizable formatting and styling options',
    icon: <FileText className='h-6 w-6' />,
    gradient: 'from-green-500 to-teal-600',
    iconBg: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
  },
  {
    type: 'grid-layout',
    title: 'Grid Layout',
    description: 'Flexible grid system to showcase multiple items in organized columns',
    icon: <Grid3X3 className='h-6 w-6' />,
    gradient: 'from-orange-500 to-red-600',
    iconBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
  },
  {
    type: 'image-text',
    title: 'Image & Text',
    description: 'Perfect combination of image and text content in various layouts',
    icon: <ImageIcon className='h-6 w-6' />,
    gradient: 'from-pink-500 to-rose-600',
    iconBg: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400'
  },
  {
    type: 'bottom-media',
    title: 'Media Section',
    description: 'Video, image or interactive media content for engaging presentations',
    icon: <Video className='h-6 w-6' />,
    gradient: 'from-indigo-500 to-blue-600',
    iconBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
  }
]

export default function SectionButtons({ onAddSection, isDragging }: SectionButtonsProps) {
  const handleDragStart = (e: React.DragEvent, sectionType: PageSection['type']) => {
    const dragData: DragData = {
      type: 'section',
      sectionType,
      source: 'palette'
    }
    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <Card className='mt-4'>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Plus className='h-5 w-5 text-primary' />
          Add Section
        </CardTitle>
        <p className='text-sm text-muted-foreground mt-1'>
          Click to add or drag to position sections on your page
        </p>
      </CardHeader>
      <CardContent className='space-y-3'>
        {sectionTypes.map((section) => (
          <div
            key={section.type}
            draggable
            onDragStart={(e) => handleDragStart(e, section.type)}
            onClick={() => onAddSection(section.type)}
            className='group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:shadow-md'
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}
            />

            <div className='relative p-4'>
              <div className='flex items-start gap-3'>
                {/* Drag Handle */}
                <div className='flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity duration-200 pt-1'>
                  <GripVertical className='h-4 w-4 text-muted-foreground' />
                </div>

                {/* Icon */}
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${section.iconBg} group-hover:scale-110 transition-transform duration-200`}
                >
                  {section.icon}
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-sm group-hover:text-primary transition-colors duration-200'>
                    {section.title}
                  </h3>
                  <p className='text-xs text-muted-foreground mt-1 leading-relaxed'>
                    {section.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  <Plus className='h-4 w-4 text-primary' />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Info Text */}
        <div className='mt-4 p-3 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/30'>
          <p className='text-xs text-muted-foreground text-center'>
            💡 Tip: Click to add at the end, or drag to position anywhere on your page
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
