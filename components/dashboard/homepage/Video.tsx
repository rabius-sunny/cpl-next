'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type TProps = {
  data?: VideoSection
}

export default function Video({ data }: TProps) {
  // State for video file
  const [videoFile, setVideoFile] = useState<MediaFile | undefined>(data)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle video upload
  const handleVideoUpload = (file: MediaFile) => {
    setVideoFile(file)
    setIsUploadingVideo(false)
  }

  // Submit handler
  const handleSave = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await updateHomepageSection('video', videoFile)

      if (result.success) {
        toast.success('Video section updated successfully')
      } else {
        setError('Failed to update video section')
        toast.error('Failed to update video section')
      }
    } catch (error) {
      console.error('Error updating video section:', error)
      setError('An unexpected error occurred')
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
          {error && <FormError message={error} />}

          {/* Video Section */}
          <div className='space-y-3'>
            <Label className='text-sm font-medium'>Video File</Label>

            {/* Video preview */}
            {videoFile?.file && (
              <div className='mb-3 relative max-w-md'>
                <div className='border rounded-md overflow-hidden relative aspect-video w-full bg-gray-100'>
                  <video
                    src={videoFile.file}
                    className='w-full h-full object-cover'
                    controls
                    preload='metadata'
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
                  <Play className='h-3 w-3' />
                  Video file uploaded
                </p>
              </div>
            )}

            {/* Loading state for video */}
            {isUploadingVideo && (
              <div className='mb-2 p-2 bg-muted/20 rounded-md flex items-center gap-2'>
                <div className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                <span className='text-xs text-muted-foreground'>Uploading video...</span>
              </div>
            )}

            {/* Video uploader */}
            <ImageUploader
              fileId={videoFile?.fileId}
              setFile={handleVideoUpload}
              onStartUpload={() => setIsUploadingVideo(true)}
            />
            <p className='text-xs text-muted-foreground'>
              Upload a video file for the homepage video section. Recommended formats: MP4, WebM.
              Keep file size under 50MB for better performance.
            </p>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end pt-2'>
            <Button
              onClick={handleSave}
              disabled={isSubmitting || isUploadingVideo}
              className='cursor-pointer'
            >
              {isSubmitting ? 'Saving...' : 'Save Video Section'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
