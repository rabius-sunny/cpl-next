'use client'

import ImageUploader from '@/components/others/ImageUploader'
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
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  data: BottomMediaSection
  onChange: (data: BottomMediaSection) => void
  onDelete: () => void
}

export default function BottomMediaEditor({ data, onChange, onDelete }: Props) {
  const [isUploading, setIsUploading] = useState(false)

  const handleMediaUpload = (file: MediaFile) => {
    onChange({ ...data, media: file })
    setIsUploading(false)
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Bottom Media Section</CardTitle>
        <Button variant='destructive' size='sm' onClick={onDelete}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Media Type */}
        <div className='space-y-2'>
          <Label>Media Type</Label>
          <Select
            value={data.type || 'image'}
            onValueChange={(value: 'image' | 'video') => onChange({ ...data, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select media type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='image'>Image</SelectItem>
              <SelectItem value='video'>Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Media Upload */}
        <div className='space-y-2'>
          <Label>{data.type === 'video' ? 'Video' : 'Image'}</Label>
          {data.media?.file && (
            <div className='relative aspect-video w-full max-w-md'>
              {data.type === 'video' ? (
                <video
                  src={data.media.file}
                  className='w-full h-full object-cover rounded-md'
                  controls
                  preload='metadata'
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={data.media.file}
                  alt={data.title || 'Bottom media'}
                  fill
                  className='object-cover rounded-md'
                />
              )}
            </div>
          )}
          <ImageUploader
            fileId={data.media?.fileId}
            setFile={handleMediaUpload}
            onStartUpload={() => setIsUploading(true)}
          />
          {isUploading && <p className='text-sm text-muted-foreground'>Uploading...</p>}
          <p className='text-xs text-muted-foreground'>
            {data.type === 'video'
              ? 'Upload a video file. Recommended formats: MP4, WebM. Keep file size under 50MB.'
              : 'Upload an image file. Recommended size: 1200x800px.'}
          </p>
        </div>

        {/* Title */}
        <div className='space-y-2'>
          <Label>Title (Optional)</Label>
          <Input
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder='Enter media title'
          />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Label>Description (Optional)</Label>
          <Textarea
            value={data.description || ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            placeholder='Enter media description'
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
