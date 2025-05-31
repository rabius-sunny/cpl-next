'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  FileText,
  Grid3X3,
  ImageIcon,
  Layout,
  Save,
  Video
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import BottomMediaEditor from '../BottomMediaEditor'
import ContentSectionEditor from '../ContentSectionEditor'
import GridLayoutEditor from '../GridLayoutEditor'
import HeaderBannerEditor from '../HeaderBannerEditor'
import ImageTextEditor from '../ImageTextEditor'
import DropZone from './DropZone'

interface PageEditorProps {
  currentPage: CustomPage
  sections: PageSection[]
  saving: boolean
  savePage: () => void
  togglePagePublish: () => void
  openPagePreview: () => void
  openEditDialog: (page: CustomPage) => void
  updateSection: (sectionId: string, data: any) => void
  deleteSection: (sectionId: string) => void
  moveSectionUp: (index: number) => void
  moveSectionDown: (index: number) => void
  addSection: (type: PageSection['type'], position?: number) => void
}

export default function PageEditor({
  currentPage,
  sections,
  saving,
  savePage,
  togglePagePublish,
  openPagePreview,
  openEditDialog,
  updateSection,
  deleteSection,
  moveSectionUp,
  moveSectionDown,
  addSection
}: PageEditorProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  useEffect(() => {
    const handleDragEnter = () => setIsDragActive(true)
    const handleDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget) {
        setIsDragActive(false)
      }
    }
    const handleDrop = () => setIsDragActive(false)

    document.addEventListener('dragenter', handleDragEnter)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragenter', handleDragEnter)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('drop', handleDrop)
    }
  }, [])

  const handleDropZoneDrop = (sectionType: PageSection['type'], position: number) => {
    addSection(sectionType, position)
  }
  const getSectionIcon = (type: string): ReactNode => {
    switch (type) {
      case 'header-banner':
        return <Layout className='h-4 w-4' />
      case 'content-section':
        return <FileText className='h-4 w-4' />
      case 'grid-layout':
        return <Grid3X3 className='h-4 w-4' />
      case 'image-text':
        return <ImageIcon className='h-4 w-4' />
      case 'bottom-media':
        return <Video className='h-4 w-4' />
      default:
        return <Layout className='h-4 w-4' />
    }
  }

  const renderSectionEditor = (section: PageSection): ReactNode => {
    const commonProps = {
      data: section.data,
      onChange: (data: any) => updateSection(section.id, data),
      onDelete: () => deleteSection(section.id)
    }

    switch (section.type) {
      case 'header-banner':
        return <HeaderBannerEditor {...commonProps} />
      case 'content-section':
        return <ContentSectionEditor {...commonProps} />
      case 'grid-layout':
        return <GridLayoutEditor {...commonProps} />
      case 'image-text':
        return <ImageTextEditor {...commonProps} />
      case 'bottom-media':
        return <BottomMediaEditor {...commonProps} />
      default:
        return (
          <Card>
            <CardContent className='p-4'>
              <p className='text-muted-foreground'>Unknown section type: {section.type}</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className='space-y-6'>
      {/* Page Actions */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Page Builder</h1>
        <div className='flex gap-2'>
          <Button onClick={savePage} disabled={saving}>
            <Save className='h-4 w-4 mr-2' />
            {saving ? 'Saving...' : 'Save Page'}
          </Button>

          <Button
            variant={currentPage.isPublished ? 'secondary' : 'default'}
            onClick={togglePagePublish}
            disabled={saving}
          >
            {currentPage.isPublished ? 'Unpublish' : 'Publish'}
          </Button>

          {currentPage.isPublished && (
            <Button variant='outline' onClick={openPagePreview}>
              <Eye className='h-4 w-4 mr-2' />
              View Page
            </Button>
          )}
        </div>
      </div>

      {/* Page Info */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle>Editing: {currentPage.title}</CardTitle>
              <p className='text-sm text-muted-foreground'>Slug: /{currentPage.slug}</p>
            </div>
            <Button variant='outline' size='sm' onClick={() => openEditDialog(currentPage)}>
              <Edit className='h-4 w-4 mr-2' />
              Edit Page
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Sections */}
      {sections.length === 0 ? (
        <Card>
          <CardContent className='p-8 text-center'>
            <p className='text-muted-foreground mb-4'>
              No sections added yet. Use the sidebar to add your first section.
            </p>
            {/* Drop zone for empty page */}
            <DropZone onDrop={handleDropZoneDrop} position={0} isVisible={isDragActive} />
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-6'>
          {/* Drop zone before first section */}
          <DropZone onDrop={handleDropZoneDrop} position={0} isVisible={isDragActive} />

          {sections.map((section, index) => (
            <div key={section.id} className='relative'>
              {/* Section Controls */}
              <div className='flex justify-between items-center mb-2'>
                <div className='flex items-center gap-2'>
                  {getSectionIcon(section.type)}
                  <span className='text-sm font-medium capitalize'>
                    {section.type.replace('-', ' ')}
                  </span>
                </div>
                <div className='flex gap-1'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => moveSectionUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className='h-3 w-3' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => moveSectionDown(index)}
                    disabled={index === sections.length - 1}
                  >
                    <ArrowDown className='h-3 w-3' />
                  </Button>
                </div>
              </div>

              {/* Section Editor */}
              {renderSectionEditor(section)}

              {/* Drop zone after each section */}
              <DropZone onDrop={handleDropZoneDrop} position={index + 1} isVisible={isDragActive} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
