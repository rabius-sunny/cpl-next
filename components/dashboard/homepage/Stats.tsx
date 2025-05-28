'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: StatsSection
}

// Define stat item schema
const statItemSchema = z.object({
  title: z.string().optional(),
  count: z.number().optional(),
  _id: z.string().optional() // For React key management
})

// Define the Zod schema for stats validation
const statsSchema = z.object({
  title: z.string().optional(),
  stats: z.array(statItemSchema).optional()
})

// Define the form type
type StatsFormValues = z.infer<typeof statsSchema>

export default function Stats({ data }: TProps) {
  // Helper to generate stable IDs
  const createStableId = (index: number) => `stat-${index}`

  // State for background image
  const [backgroundImage, setBackgroundImage] = useState<MediaFile | undefined>(
    data?.backgroundImage
  )
  const [isUploadingBackground, setIsUploadingBackground] = useState(false)

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form with default values from data prop
  const form = useForm<StatsFormValues>({
    resolver: zodResolver(statsSchema),
    defaultValues: {
      title: data?.title || '',
      stats:
        data?.stats?.map((stat, index) => ({
          title: stat.title || '',
          count: stat.count || 0,
          _id: createStableId(index)
        })) || []
    },
    mode: 'onBlur'
  })

  // Set up field array for managing stat items
  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat
  } = useFieldArray({
    control: form.control,
    name: 'stats'
  })

  // Add a new stat item
  const addStat = () => {
    const currentLength = statFields.length
    const newId = createStableId(currentLength)

    appendStat({
      title: '',
      count: 0,
      _id: newId
    })
  }

  // Handle background image upload
  const handleBackgroundImageUpload = (file: MediaFile) => {
    setBackgroundImage(file)
    setIsUploadingBackground(false)
  }

  // Submit handler
  const onSubmit = async (values: StatsFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Process stats data
      const processedStats: StatItem[] = (values.stats || []).map((stat) => ({
        title: stat.title,
        count: stat.count
      }))

      const statsData: StatsSection = {
        title: values.title,
        backgroundImage,
        stats: processedStats.length > 0 ? processedStats : undefined
      }

      const result = await updateHomepageSection('stats', statsData)

      if (result.success) {
        toast.success('Stats section updated successfully')
      } else {
        setError('Failed to update stats section')
        toast.error('Failed to update stats section')
      }
    } catch (error) {
      console.error('Error updating stats section:', error)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold lg:text-2xl'>Stats Section</h1>
        <Button
          type='button'
          onClick={addStat}
          variant='default'
          size='sm'
          className='cursor-pointer'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Stat
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {error && <FormError message={error} />}

          {/* Section Title and Background Image */}
          <Card className='border border-gray-200 hover:border-black'>
            <CardHeader className='p-4 pb-3'>
              <CardTitle className='text-base'>Section Settings</CardTitle>
            </CardHeader>

            <CardContent className='p-4 pt-0 space-y-4'>
              {/* Section Title */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter stats section title' {...field} className='h-9' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className='my-4' />

              {/* Background Image Section */}
              <div className='space-y-3'>
                <Label className='text-sm font-medium'>Background Image</Label>

                {/* Background image preview */}
                {backgroundImage?.file && (
                  <div className='mb-3 relative max-w-xs'>
                    <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                      <Image
                        src={backgroundImage.file}
                        alt='Stats background'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>Background image</p>
                  </div>
                )}

                {/* Loading state for background image */}
                {isUploadingBackground && (
                  <div className='mb-2 p-2 bg-muted/20 rounded-md flex items-center gap-2'>
                    <div className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                    <span className='text-xs text-muted-foreground'>
                      Uploading background image...
                    </span>
                  </div>
                )}

                {/* Background image uploader */}
                <ImageUploader
                  fileId={backgroundImage?.fileId}
                  setFile={handleBackgroundImageUpload}
                  onStartUpload={() => setIsUploadingBackground(true)}
                />
                <p className='text-xs text-muted-foreground'>
                  Upload a background image for the stats section. Recommended size: 1920x1080px.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Items */}
          {statFields.length > 0 && (
            <Card className='border border-gray-200 hover:border-black'>
              <CardHeader className='p-4 pb-3'>
                <CardTitle className='text-base'>Stats Items</CardTitle>
              </CardHeader>

              <CardContent className='p-4 pt-0 space-y-3'>
                {statFields.map((field, index) => (
                  <div key={field.id} className='flex items-end gap-2'>
                    {/* Title field */}
                    <FormField
                      control={form.control}
                      name={`stats.${index}.title`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel className='text-xs text-muted-foreground'>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter stat title'
                              {...field}
                              className='h-7 text-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Count field */}
                    <FormField
                      control={form.control}
                      name={`stats.${index}.count`}
                      render={({ field }) => (
                        <FormItem className='w-24'>
                          <FormLabel className='text-xs text-muted-foreground'>Count</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='0'
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className='h-7 text-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove button */}
                    <Button
                      type='button'
                      onClick={() => removeStat(index)}
                      variant='ghost'
                      size='icon'
                      className='size-7 bg-red-100 text-destructive hover:text-white cursor-pointer hover:bg-destructive mb-0'
                      disabled={statFields.length <= 1}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {statFields.length === 0 && (
            <div className='text-center py-8 text-muted-foreground border border-dashed rounded-md'>
              <p>No stats added yet. Click the "Add Stat" button to add one.</p>
            </div>
          )}

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
            <Button type='submit' disabled={isSubmitting} className='cursor-pointer'>
              {isSubmitting ? 'Saving...' : 'Save Stats Section'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
