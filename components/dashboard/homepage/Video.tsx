'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type TProps = {
  data?: string
}

export default function Video({ data }: TProps) {
  // State for video file
  const [videoLink, setVideoLink] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Initialize video link from props if available
    if (data) {
      setVideoLink(data)
    }
  }, [])

  // Submit handler
  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      const result = await updateHomepageSection('video', videoLink)

      if (result.success) {
        toast.success('Video section updated successfully')
      } else {
        toast.error('Failed to update video section')
      }
    } catch (error) {
      console.error('Error updating video section:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold lg:text-2xl'>Video Section</h1>
      </div>

      <Card className='border border-gray-200 hover:border-black'>
        <CardHeader className='p-4 pb-3'>
          <CardTitle className='text-base'>Homepage Video</CardTitle>
        </CardHeader>

        <CardContent className='p-4 pt-0 space-y-4'>
          {/* Video Section */}
          <div className='space-y-3'>
            <Label className='text-sm font-medium'>Youtube Video Link</Label>

            {/* Video preview */}
            <div className='mb-3 relative max-w-md'>
              <Input
                type='text'
                defaultValue={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder='Enter YouTube video link'
                className='w-full'
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end pt-2'>
            <Button onClick={handleSave} disabled={isSubmitting} className='cursor-pointer'>
              {isSubmitting ? 'Saving...' : 'Save Video Section'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
