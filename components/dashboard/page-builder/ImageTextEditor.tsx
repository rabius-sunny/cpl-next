'use client'

import ImageUploader from '@/components/others/ImageUploader'
import Editor from '@/components/shared/Editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  data: ImageTextSection
  onChange: (data: ImageTextSection) => void
  onDelete: () => void
}

export default function ImageTextEditor({ data, onChange, onDelete }: Props) {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (file: MediaFile) => {
    onChange({ ...data, image: file })
    setIsUploading(false)
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Image & Text Section</CardTitle>
        <Button variant='destructive' size='sm' onClick={onDelete}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Image Position */}
        <div className='space-y-2'>
          <Label>Image Position</Label>
          <Select
            value={data.imagePosition || 'left'}
            onValueChange={(value: 'left' | 'right') => onChange({ ...data, imagePosition: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select image position' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='left'>Left</SelectItem>
              <SelectItem value='right'>Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Image Upload */}
          <div className='space-y-2'>
            <Label>Image</Label>
            {data.image?.file && (
              <div className='relative aspect-square w-full max-w-[300px]'>
                <Image
                  src={data.image.file}
                  alt={data.title || 'Section image'}
                  fill
                  className='object-cover rounded-md'
                />
              </div>
            )}
            <ImageUploader
              fileId={data.image?.fileId}
              setFile={handleImageUpload}
              onStartUpload={() => setIsUploading(true)}
            />
            {isUploading && <p className='text-sm text-muted-foreground'>Uploading...</p>}
          </div>

          {/* Text Content */}
          <div className='space-y-4'>
            {/* Title */}
            <div className='space-y-2'>
              <Label>Title</Label>
              <Input
                value={data.title || ''}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
                placeholder='Enter section title'
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
