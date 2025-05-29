'use client'

import Editor from '@/components/shared/Editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'

type Props = {
  data: ContentSection
  onChange: (data: ContentSection) => void
  onDelete: () => void
}

export default function ContentSectionEditor({ data, onChange, onDelete }: Props) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Content Section</CardTitle>
        <Button variant='destructive' size='sm' onClick={onDelete}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Title */}
        <div className='space-y-2'>
          <Label>Section Title</Label>
          <Input
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder='Enter section title (e.g., Quality Assurance)'
          />
        </div>

        {/* Content */}
        <div className='space-y-2'>
          <Label>Content</Label>
          <Editor
            content={data.content || ''}
            onChange={(content) => onChange({ ...data, content })}
            placeholder='Enter section content...'
            className='min-h-[200px]'
          />
        </div>
      </CardContent>
    </Card>
  )
}
