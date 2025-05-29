'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import PageBuilderHeader from './components/PageBuilderHeader'
import PageDialogs from './components/PageDialogs'
import PageEditor from './components/PageEditor'
import PageList from './components/PageList'
import SectionButtons from './components/SectionButtons'
import { useCurrentPage } from './hooks/useCurrentPage'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { usePages } from './hooks/usePages'

export default function PageBuilder() {
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [newPageSlug, setNewPageSlug] = useState('')
  const [editPageTitle, setEditPageTitle] = useState('')
  const [editPageSlug, setEditPageSlug] = useState('')

  // Custom hooks for data management
  const {
    pages,
    loading: pagesLoading,
    createNewPage,
    updatePageMetadata,
    deletePageHandler,
    togglePagePublish
  } = usePages()

  const {
    currentPage,
    sections,
    loading: pageLoading,
    saving,
    loadPage,
    savePage,
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    setCurrentPage,
    setSections
  } = useCurrentPage()

  // Drag and drop state
  const { isDragging } = useDragAndDrop()

  const loading = pagesLoading || pageLoading

  const handleCreatePage = async () => {
    const newPage = await createNewPage(newPageTitle, newPageSlug)
    if (newPage) {
      setNewPageTitle('')
      setNewPageSlug('')
      setShowCreateDialog(false)
      // Auto-select the new page
      await loadPage(newPage._id!)
    }
  }

  const handleUpdateMetadata = async () => {
    if (!currentPage) return

    const updatedPage = await updatePageMetadata(currentPage._id!, editPageTitle, editPageSlug)

    if (updatedPage) {
      setCurrentPage(updatedPage)
      setShowEditDialog(false)
    }
  }

  const openEditDialog = (page: CustomPage) => {
    setEditPageTitle(page.title)
    setEditPageSlug(page.slug)
    setShowEditDialog(true)
  }

  const openPagePreview = () => {
    if (currentPage && currentPage.isPublished) {
      window.open(`/${currentPage.slug}`, '_blank')
    }
  }

  const handleTogglePublish = async () => {
    if (currentPage) {
      const updatedPage = await togglePagePublish(currentPage)
      if (updatedPage) {
        setCurrentPage(updatedPage)
      }
    }
  }

  const handlePageSelect = async (pageId: string) => {
    await loadPage(pageId)
  }

  const handleDeletePage = async (pageId: string, pageTitle: string) => {
    const success = await deletePageHandler(pageId, pageTitle)
    if (success && currentPage?._id === pageId) {
      setCurrentPage(null)
      setSections([])
    }
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <PageBuilderHeader
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
      />

      {/* Dialogs */}
      <PageDialogs
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        newPageTitle={newPageTitle}
        setNewPageTitle={setNewPageTitle}
        newPageSlug={newPageSlug}
        setNewPageSlug={setNewPageSlug}
        createNewPage={handleCreatePage}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        editPageTitle={editPageTitle}
        setEditPageTitle={setEditPageTitle}
        editPageSlug={editPageSlug}
        setEditPageSlug={setEditPageSlug}
        updatePageMetadata={handleUpdateMetadata}
        loading={loading}
        saving={saving}
      />

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Sidebar - Page List and Section Buttons */}
        <div className='lg:col-span-1 space-y-4'>
          <PageList
            pages={pages}
            currentPage={currentPage}
            loading={loading}
            onPageSelect={handlePageSelect}
            onDeletePage={handleDeletePage}
          />

          {currentPage && <SectionButtons onAddSection={addSection} isDragging={isDragging} />}
        </div>

        {/* Main Content - Page Editor */}
        <div className='lg:col-span-3'>
          {currentPage ? (
            <PageEditor
              currentPage={currentPage}
              sections={sections}
              saving={saving}
              savePage={savePage}
              togglePagePublish={handleTogglePublish}
              openPagePreview={openPagePreview}
              openEditDialog={openEditDialog}
              updateSection={updateSection}
              deleteSection={deleteSection}
              moveSectionUp={moveSectionUp}
              moveSectionDown={moveSectionDown}
              addSection={addSection}
            />
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
