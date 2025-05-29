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
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  data: GridLayoutSection
  onChange: (data: GridLayoutSection) => void
  onDelete: () => void
}

export default function GridLayoutEditor({ data, onChange, onDelete }: Props) {
  const [uploadingItems, setUploadingItems] = useState<{ [key: string]: boolean }>({})

  const addGridItem = () => {
    const newItem: GridItem = {
      id: `grid-item-${Date.now()}`,
      title: '',
      description: ''
    }
    onChange({
      ...data,
      items: [...(data.items || []), newItem]
    })
  }

  const updateGridItem = (itemId: string, updates: Partial<GridItem>) => {
    const updatedItems = (data.items || []).map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    )
    onChange({ ...data, items: updatedItems })
  }

  const deleteGridItem = (itemId: string) => {
    const filteredItems = (data.items || []).filter((item) => item.id !== itemId)
    onChange({ ...data, items: filteredItems })
  }

  const handleImageUpload = (itemId: string, file: MediaFile) => {
    updateGridItem(itemId, { image: file })
    setUploadingItems((prev) => ({ ...prev, [itemId]: false }))
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Grid Layout</CardTitle>
        <Button variant='destructive' size='sm' onClick={onDelete}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Section Title */}
        <div className='space-y-2'>
          <Label>Section Title</Label>
          <Input
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder='Enter grid section title'
          />
        </div>

        {/* Columns */}
        <div className='space-y-2'>
          <Label>Columns</Label>
          <Select
            value={data.columns?.toString() || '3'}
            onValueChange={(value) => onChange({ ...data, columns: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select columns' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='2'>2 Columns</SelectItem>
              <SelectItem value='3'>3 Columns</SelectItem>
              <SelectItem value='4'>4 Columns</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid Items */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <Label>Grid Items</Label>
            <Button variant='outline' size='sm' onClick={addGridItem}>
              <Plus className='h-4 w-4 mr-2' />
              Add Item
            </Button>
          </div>

          <div className='space-y-4'>
            {(data.items || []).map((item, index) => (
              <Card key={item.id} className='p-4'>
                <div className='flex justify-between items-start mb-4'>
                  <h4 className='font-medium'>Item {index + 1}</h4>
                  <Button variant='destructive' size='sm' onClick={() => deleteGridItem(item.id)}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Image Upload */}
                  <div className='space-y-2'>
                    <Label>Image</Label>
                    {item.image?.file && (
                      <div className='relative aspect-square w-full max-w-[200px]'>
                        <Image
                          src={item.image.file}
                          alt={item.title || 'Grid item'}
                          fill
                          className='object-cover rounded-md'
                        />
                      </div>
                    )}
                    <ImageUploader
                      fileId={item.image?.fileId}
                      setFile={(file) => handleImageUpload(item.id, file)}
                      onStartUpload={() =>
                        setUploadingItems((prev) => ({ ...prev, [item.id]: true }))
                      }
                    />
                    {uploadingItems[item.id] && (
                      <p className='text-sm text-muted-foreground'>Uploading...</p>
                    )}
                  </div>

                  {/* Title and Description */}
                  <div className='space-y-3'>
                    <div className='space-y-2'>
                      <Label>Title</Label>
                      <Input
                        value={item.title || ''}
                        onChange={(e) => updateGridItem(item.id, { title: e.target.value })}
                        placeholder='Enter item title'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>Description</Label>
                      <Input
                        value={item.description || ''}
                        onChange={(e) => updateGridItem(item.id, { description: e.target.value })}
                        placeholder='Enter item description'
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
