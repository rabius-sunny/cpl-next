'use client'

import {
  createPage,
  deletePage,
  getPageById,
  getPages,
  updatePage,
  updatePageSections
} from '@/actions/data/pages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  FileText,
  Grid3X3,
  ImageIcon,
  Layout,
  Plus,
  Save,
  Trash2,
  Video
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import BottomMediaEditor from './BottomMediaEditor'
import ContentSectionEditor from './ContentSectionEditor'
import GridLayoutEditor from './GridLayoutEditor'
import HeaderBannerEditor from './HeaderBannerEditor'
import ImageTextEditor from './ImageTextEditor'

export default function PageBuilder() {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [currentPage, setCurrentPage] = useState<CustomPage | null>(null)
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // New page creation
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [newPageSlug, setNewPageSlug] = useState('')

  // Edit page metadata
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editPageTitle, setEditPageTitle] = useState('')
  const [editPageSlug, setEditPageSlug] = useState('')

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    setLoading(true)
    try {
      const result = await getPages()
      if (result.success && result.data) {
        setPages(result.data)
      }
    } catch (error) {
      console.error('Error loading pages:', error)
      toast.error('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const loadPage = async (pageId: string) => {
    setLoading(true)
    try {
      const result = await getPageById(pageId)
      if (result.success && result.data) {
        setCurrentPage(result.data)
        setSections(result.data.sections || [])
      }
    } catch (error) {
      console.error('Error loading page:', error)
      toast.error('Failed to load page')
    } finally {
      setLoading(false)
    }
  }

  const createNewPage = async () => {
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      toast.error('Please provide both title and slug')
      return
    }

    setLoading(true)
    try {
      const result = await createPage(newPageTitle, newPageSlug)
      if (result.success && result.data) {
        setPages((prev) => [result.data, ...prev])
        setCurrentPage(result.data)
        setSections([])
        setShowCreateDialog(false)
        setNewPageTitle('')
        setNewPageSlug('')
        toast.success('Page created successfully')
      } else {
        toast.error(result.error || 'Failed to create page')
      }
    } catch (error) {
      console.error('Error creating page:', error)
      toast.error('Failed to create page')
    } finally {
      setLoading(false)
    }
  }

  const addSection = (type: PageSection['type']) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      order: sections.length,
      data: getDefaultDataForType(type)
    }
    setSections((prev) => [...prev, newSection])
  }

  const getDefaultDataForType = (type: PageSection['type']) => {
    switch (type) {
      case 'header-banner':
        return { title: '', subtitle: '' }
      case 'content-section':
        return { title: '', content: '' }
      case 'grid-layout':
        return { title: '', columns: 3, items: [] }
      case 'image-text':
        return { title: '', content: '', imagePosition: 'left' }
      case 'bottom-media':
        return { type: 'image', title: '', description: '' }
      default:
        return {}
    }
  }

  const updateSection = (sectionId: string, data: any) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, data } : section))
    )
  }

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId))
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    setSections((prev) => {
      const newSections = [...prev]
      const temp = newSections[index]
      newSections[index] = newSections[index - 1]
      newSections[index - 1] = temp

      // Update order values
      return newSections.map((section, i) => ({ ...section, order: i }))
    })
  }

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return
    setSections((prev) => {
      const newSections = [...prev]
      const temp = newSections[index]
      newSections[index] = newSections[index + 1]
      newSections[index + 1] = temp

      // Update order values
      return newSections.map((section, i) => ({ ...section, order: i }))
    })
  }

  const savePage = async () => {
    if (!currentPage) {
      toast.error('No page selected')
      return
    }

    setSaving(true)
    try {
      const result = await updatePageSections(currentPage._id!, sections)
      if (result.success) {
        toast.success('Page saved successfully')
      } else {
        toast.error(result.error || 'Failed to save page')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error('Failed to save page')
    } finally {
      setSaving(false)
    }
  }

  const togglePagePublish = async () => {
    if (!currentPage) {
      toast.error('No page selected')
      return
    }

    setSaving(true)
    try {
      const newPublishState = !currentPage.isPublished
      const result = await updatePage(currentPage._id!, { isPublished: newPublishState })
      if (result.success) {
        setCurrentPage((prev) => (prev ? { ...prev, isPublished: newPublishState } : null))
        setPages((prev) =>
          prev.map((page) =>
            page._id === currentPage._id ? { ...page, isPublished: newPublishState } : page
          )
        )
        toast.success(`Page ${newPublishState ? 'published' : 'unpublished'} successfully`)
      } else {
        toast.error(result.error || 'Failed to update page')
      }
    } catch (error) {
      console.error('Error updating page:', error)
      toast.error('Failed to update page')
    } finally {
      setSaving(false)
    }
  }

  const openEditDialog = (page: CustomPage) => {
    setEditPageTitle(page.title)
    setEditPageSlug(page.slug)
    setShowEditDialog(true)
  }

  const updatePageMetadata = async () => {
    if (!currentPage) {
      toast.error('No page selected')
      return
    }

    if (!editPageTitle.trim() || !editPageSlug.trim()) {
      toast.error('Please provide both title and slug')
      return
    }

    setSaving(true)
    try {
      const oldSlug = currentPage.slug
      const result = await updatePage(currentPage._id!, {
        title: editPageTitle,
        slug: editPageSlug
      })

      if (result.success && result.data) {
        // Update current page
        setCurrentPage(result.data)

        // Update pages list
        setPages((prev) => prev.map((page) => (page._id === currentPage._id ? result.data : page)))

        // If slug changed, revalidate both old and new paths
        if (oldSlug !== editPageSlug) {
          // The updatePage function already handles revalidation
        }

        setShowEditDialog(false)
        toast.success('Page updated successfully')
      } else {
        toast.error(result.error || 'Failed to update page')
      }
    } catch (error) {
      console.error('Error updating page:', error)
      toast.error('Failed to update page')
    } finally {
      setSaving(false)
    }
  }

  const deletePageHandler = async (pageId: string, pageTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${pageTitle}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setLoading(true)
    try {
      const result = await deletePage(pageId)
      if (result.success) {
        // Remove from pages list
        setPages((prev) => prev.filter((page) => page._id !== pageId))

        // Clear current page if it was the deleted one
        if (currentPage?._id === pageId) {
          setCurrentPage(null)
          setSections([])
        }

        toast.success('Page deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete page')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      toast.error('Failed to delete page')
    } finally {
      setLoading(false)
    }
  }

  const openPagePreview = () => {
    if (!currentPage) {
      toast.error('No page selected')
      return
    }

    if (!currentPage.isPublished) {
      toast.warning('Page is not published yet')
      return
    }

    const url = `/${currentPage.slug}`
    window.open(url, '_blank')
  }

  const getSectionIcon = (type: PageSection['type']) => {
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
        return <FileText className='h-4 w-4' />
    }
  }

  const renderSectionEditor = (section: PageSection) => {
    const commonProps = {
      onDelete: () => deleteSection(section.id),
      onChange: (data: any) => updateSection(section.id, data)
    }

    switch (section.type) {
      case 'header-banner':
        return <HeaderBannerEditor data={section.data} {...commonProps} />
      case 'content-section':
        return <ContentSectionEditor data={section.data} {...commonProps} />
      case 'grid-layout':
        return <GridLayoutEditor data={section.data} {...commonProps} />
      case 'image-text':
        return <ImageTextEditor data={section.data} {...commonProps} />
      case 'bottom-media':
        return <BottomMediaEditor data={section.data} {...commonProps} />
      default:
        return null
    }
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Page Builder</h1>
        <div className='flex gap-3'>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                New Page
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
              </DialogHeader>
              <div className='space-y-4 pt-4'>
                <div className='space-y-2'>
                  <Label>Page Title</Label>
                  <Input
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder='Enter page title'
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Page Slug</Label>
                  <Input
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    placeholder='enter-page-slug'
                  />
                </div>
                <div className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewPage} disabled={loading}>
                    Create Page
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Page Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Page</DialogTitle>
              </DialogHeader>
              <div className='space-y-4 pt-4'>
                <div className='space-y-2'>
                  <Label>Page Title</Label>
                  <Input
                    value={editPageTitle}
                    onChange={(e) => setEditPageTitle(e.target.value)}
                    placeholder='Enter page title'
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Page Slug</Label>
                  <Input
                    value={editPageSlug}
                    onChange={(e) => setEditPageSlug(e.target.value)}
                    placeholder='enter-page-slug'
                  />
                </div>
                <div className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updatePageMetadata} disabled={saving}>
                    {saving ? 'Updating...' : 'Update Page'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {currentPage && (
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
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Sidebar - Page List */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='space-y-2'>
                {pages.map((page) => (
                  <div
                    key={page._id}
                    className={`border cursor-pointer  transition-all duration-200 hover:shadow-sm ${
                      currentPage?._id === page._id
                        ? 'bg-primary/30 border-primary/20 shadow-sm'
                        : 'bg-background border-border hover:bg-muted/50'
                    }`}
                    onClick={() => loadPage(page._id!)}
                  >
                    <div className='flex items-start justify-between p-3 gap-3'>
                      <button className='flex-1 text-left min-w-0'>
                        <div className='space-y-1'>
                          <div className='font-medium text-sm leading-tight truncate pr-2'>
                            {page.title}
                          </div>
                          <div className='text-xs text-muted-foreground truncate'>/{page.slug}</div>
                        </div>
                      </button>

                      <div className='flex items-center gap-2 flex-shrink-0'>
                        <div
                          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            page.isPublished
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {page.isPublished ? 'Published' : 'Draft'}
                        </div>

                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePageHandler(page._id!, page.title)
                          }}
                          className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {pages.length === 0 && (
                  <div className='p-6 text-center text-muted-foreground border border-dashed rounded-lg'>
                    <p>No pages yet. Create your first page!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add Section Buttons */}
          {currentPage && (
            <Card className='mt-4'>
              <CardHeader>
                <CardTitle>Add Section</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => addSection('header-banner')}
                >
                  <Layout className='h-4 w-4 mr-2' />
                  Header Banner
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => addSection('content-section')}
                >
                  <FileText className='h-4 w-4 mr-2' />
                  Content Section
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => addSection('grid-layout')}
                >
                  <Grid3X3 className='h-4 w-4 mr-2' />
                  Grid Layout
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => addSection('image-text')}
                >
                  <ImageIcon className='h-4 w-4 mr-2' />
                  Image & Text
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => addSection('bottom-media')}
                >
                  <Video className='h-4 w-4 mr-2' />
                  Bottom Media
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content - Page Editor */}
        <div className='lg:col-span-3'>
          {currentPage ? (
            <div className='space-y-6'>
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
                  </CardContent>
                </Card>
              ) : (
                <div className='space-y-6'>
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className='p-8 text-center'>
                <p className='text-muted-foreground'>
                  Select a page from the sidebar to start editing, or create a new page.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
