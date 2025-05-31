'use client'

import ImageUploader from '@/components/others/ImageUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  data: HeaderBannerSection
  onChange: (data: HeaderBannerSection) => void
  onDelete: () => void
}

export default function HeaderBannerEditor({ data, onChange, onDelete }: Props) {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (file: MediaFile) => {
    onChange({ ...data, image: file })
    setIsUploading(false)
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Header Banner</CardTitle>
        <Button variant='destructive' size='sm' onClick={onDelete}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Image Upload */}
        <div className='space-y-2'>
          <Label>Banner Image</Label>
          {data.image?.file && (
            <div className='relative aspect-video w-full max-w-md'>
              <Image src={data.image.file} alt='Banner' fill className='object-cover rounded-md' />
            </div>
          )}
          <ImageUploader
            fileId={data.image?.fileId}
            setFile={handleImageUpload}
            onStartUpload={() => setIsUploading(true)}
          />
          {isUploading && <p className='text-sm text-muted-foreground'>Uploading...</p>}
        </div>

        {/* Title */}
        <div className='space-y-2'>
          <Label>Title</Label>
          <Input
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder='Enter banner title'
          />
        </div>

        {/* Subtitle */}
        <div className='space-y-2'>
          <Label>Subtitle</Label>
          <Textarea
            value={data.subtitle || ''}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            placeholder='Enter banner subtitle'
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
