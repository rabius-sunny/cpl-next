'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PageDialogsProps {
  // Create page dialog
  showCreateDialog: boolean
  setShowCreateDialog: (show: boolean) => void
  newPageTitle: string
  setNewPageTitle: (title: string) => void
  newPageSlug: string
  setNewPageSlug: (slug: string) => void
  createNewPage: () => void

  // Edit page dialog
  showEditDialog: boolean
  setShowEditDialog: (show: boolean) => void
  editPageTitle: string
  setEditPageTitle: (title: string) => void
  editPageSlug: string
  setEditPageSlug: (slug: string) => void
  updatePageMetadata: () => void

  loading: boolean
  saving: boolean
}

export default function PageDialogs({
  showCreateDialog,
  setShowCreateDialog,
  newPageTitle,
  setNewPageTitle,
  newPageSlug,
  setNewPageSlug,
  createNewPage,
  showEditDialog,
  setShowEditDialog,
  editPageTitle,
  setEditPageTitle,
  editPageSlug,
  setEditPageSlug,
  updatePageMetadata,
  loading,
  saving
}: PageDialogsProps) {
  return (
    <>
      {/* Create Page Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
    </>
  )
}
