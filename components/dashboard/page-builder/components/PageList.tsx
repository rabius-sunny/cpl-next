'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

interface PageListProps {
  pages: CustomPage[]
  currentPage: CustomPage | null
  loading: boolean
  onPageSelect: (pageId: string) => void
  onDeletePage: (pageId: string, pageTitle: string) => void
}

export default function PageList({
  pages,
  currentPage,
  loading,
  onPageSelect,
  onDeletePage
}: PageListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pages</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='space-y-2'>
          {pages.map((page) => (
            <div
              key={page._id}
              className={`border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                currentPage?._id === page._id
                  ? 'bg-primary/30 border-primary/20 shadow-sm'
                  : 'bg-background border-border hover:bg-muted/50'
              }`}
              onClick={() => onPageSelect(page._id!)}
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
                      onDeletePage(page._id!, page.title)
                    }}
                    className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950'
                    disabled={loading}
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
  )
}
