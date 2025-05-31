'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

interface PageBuilderHeaderProps {
  showCreateDialog: boolean
  setShowCreateDialog: (show: boolean) => void
}

export default function PageBuilderHeader({
  showCreateDialog,
  setShowCreateDialog
}: PageBuilderHeaderProps) {
  return (
    <div className='flex justify-between items-center mb-6'>
      <h1 className='text-2xl font-bold'>Page Builder</h1>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button>
            <Plus className='h-4 w-4 mr-2' />
            Create New Page
          </Button>
        </DialogTrigger>
        <DialogContent>{/* Content handled by PageDialogs component */}</DialogContent>
      </Dialog>
    </div>
  )
}
