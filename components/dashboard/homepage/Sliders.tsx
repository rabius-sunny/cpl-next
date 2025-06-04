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
  data?: SliderItem[]
}

// Define slider item schema
const sliderItemSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  _id: z.string().optional() // For React key management
})

// Define the Zod schema for sliders validation
const slidersSchema = z.object({
  sliders: z.array(sliderItemSchema).optional()
})

// Define the form type
type SlidersFormValues = z.infer<typeof slidersSchema>

export default function Sliders({ data }: TProps) {
  // Helper to generate stable IDs
  const createStableId = (index: number) => `slider-${index}`

  // State for slider background images and additional images
  const [sliderBackgrounds, setSliderBackgrounds] = useState<{ [key: string]: MediaFile }>({})
  const [sliderImages, setSliderImages] = useState<{ [key: string]: MediaFile[] }>({})
  const [isUploadingBackground, setIsUploadingBackground] = useState<{ [key: string]: boolean }>({})
  const [isUploadingAdditional, setIsUploadingAdditional] = useState<{ [key: string]: boolean }>({})

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize slider states from data
  const initializeSliderStates = () => {
    if (!data) return

    const backgroundsMap: { [key: string]: MediaFile } = {}
    const imagesMap: { [key: string]: MediaFile[] } = {}

    data.forEach((slider, index) => {
      const id = createStableId(index)
      if (slider.backgroundImage) {
        backgroundsMap[id] = slider.backgroundImage
      }
      if (slider.images && slider.images.length > 0) {
        imagesMap[id] = slider.images
      }
    })

    setSliderBackgrounds(backgroundsMap)
    setSliderImages(imagesMap)
  }

  // Initialize states on component mount
  useState(() => {
    initializeSliderStates()
  })

  // Create form with default values from data prop
  const form = useForm<SlidersFormValues>({
    resolver: zodResolver(slidersSchema),
    defaultValues: {
      sliders:
        data?.map((slider, index) => ({
          title: slider.title || '',
          subtitle: slider.subtitle || '',
          _id: createStableId(index)
        })) || []
    },
    mode: 'onSubmit'
  })

  // Set up field array for managing slider items
  const {
    fields: sliderFields,
    append: appendSlider,
    remove: removeSlider
  } = useFieldArray({
    control: form.control,
    name: 'sliders'
  })

  // Add a new slider item
  const addSlider = () => {
    const currentLength = sliderFields.length
    const newId = createStableId(currentLength)

    appendSlider({
      title: '',
      subtitle: '',
      _id: newId
    })
  }

  // Remove a slider item and clean up its states
  const handleRemoveSlider = (index: number) => {
    const sliderId = sliderFields[index]._id

    if (sliderId) {
      // Clean up states
      setSliderBackgrounds((prev) => {
        const newState = { ...prev }
        delete newState[sliderId]
        return newState
      })

      setSliderImages((prev) => {
        const newState = { ...prev }
        delete newState[sliderId]
        return newState
      })

      setIsUploadingBackground((prev) => {
        const newState = { ...prev }
        delete newState[sliderId]
        return newState
      })

      setIsUploadingAdditional((prev) => {
        const newState = { ...prev }
        delete newState[sliderId]
        return newState
      })
    }

    removeSlider(index)
  }

  // Handle background image upload
  const handleBackgroundImageUpload = (sliderId: string, file: MediaFile) => {
    setSliderBackgrounds((prev) => ({
      ...prev,
      [sliderId]: file
    }))
    setIsUploadingBackground((prev) => ({
      ...prev,
      [sliderId]: false
    }))
  }

  // Handle additional image upload
  const handleAdditionalImageUpload = (sliderId: string, file: MediaFile) => {
    setSliderImages((prev) => ({
      ...prev,
      [sliderId]: [...(prev[sliderId] || []), file]
    }))
    // Clear loading state
    setIsUploadingAdditional((prev) => ({
      ...prev,
      [sliderId]: false
    }))
  }

  // Remove additional image
  const removeAdditionalImage = (sliderId: string, imageIndex: number) => {
    setSliderImages((prev) => {
      const currentImages = prev[sliderId] || []
      const newImages = [...currentImages]
      newImages.splice(imageIndex, 1)

      if (newImages.length === 0) {
        const newState = { ...prev }
        delete newState[sliderId]
        return newState
      }

      return {
        ...prev,
        [sliderId]: newImages
      }
    })
  }

  // Submit handler
  const onSubmit = async (values: SlidersFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Process sliders with their images
      const slidersWithImages: SliderItem[] = (values.sliders || []).map((slider) => {
        const sliderId = slider._id!
        const backgroundImage = sliderBackgrounds[sliderId]
        const images = sliderImages[sliderId]

        return {
          title: slider.title,
          subtitle: slider.subtitle,
          backgroundImage,
          images: images && images.length > 0 ? images : undefined
        }
      })

      const result = await updateHomepageSection('sliders', slidersWithImages)

      if (result.success) {
        toast.success('Sliders updated successfully')
      } else {
        setError('Failed to update sliders')
        toast.error('Failed to update sliders')
      }
    } catch (error) {
      console.error('Error updating sliders:', error)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold lg:text-2xl'>Sliders Management</h1>
        <Button
          type='button'
          onClick={addSlider}
          variant='default'
          size='sm'
          className='cursor-pointer'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Slider
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {error && <FormError message={error} />}

          {/* Slider Items */}
          <div className='space-y-4'>
            {sliderFields.map((field, index) => {
              const sliderId = field._id || createStableId(index)
              const backgroundImage = sliderBackgrounds[sliderId]
              const additionalImages = sliderImages[sliderId] || []

              return (
                <Card key={field.id} className='p-3 border border-gray-200 hover:border-black'>
                  <CardHeader className='p-0 pb-3'>
                    <div className='flex justify-between items-center'>
                      <CardTitle className='text-base'>Slider {index + 1}</CardTitle>
                      <Button
                        type='button'
                        onClick={() => handleRemoveSlider(index)}
                        variant='ghost'
                        size='icon'
                        className='size-7 bg-red-100 text-destructive hover:text-white cursor-pointer hover:bg-destructive'
                        disabled={sliderFields.length <= 1}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className='p-0 space-y-3'>
                    {/* Basic Fields */}
                    <div className='grid md:grid-cols-2 gap-3'>
                      {/* Title field */}
                      <FormField
                        control={form.control}
                        name={`sliders.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs text-muted-foreground'>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter slider title'
                                {...field}
                                className='h-7 text-sm'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Subtitle field */}
                      <FormField
                        control={form.control}
                        name={`sliders.${index}.subtitle`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs text-muted-foreground'>
                              Subtitle
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter slider subtitle'
                                {...field}
                                className='h-7 text-sm'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className='my-2' />

                    {/* Background Image Section */}
                    <div className='space-y-2'>
                      <Label className='text-xs text-muted-foreground'>Background Image</Label>

                      {/* Background image preview */}
                      {backgroundImage?.file && (
                        <div className='mb-3 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                            <Image
                              src={backgroundImage.file || '/placeholder.webp'}
                              alt={`Slider ${index + 1} background`}
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='text-xs text-muted-foreground mt-1'>Background image</p>
                        </div>
                      )}

                      {/* Loading state for background image */}
                      {isUploadingBackground[sliderId] && (
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
                        setFile={(file) => handleBackgroundImageUpload(sliderId, file)}
                        onStartUpload={() => {
                          if (sliderId) {
                            setIsUploadingBackground((prev) => ({ ...prev, [sliderId]: true }))
                          }
                        }}
                      />
                      <p className='text-xs text-muted-foreground'>
                        Upload a background image for the slider. Recommended size: 1920x1080px.
                      </p>
                    </div>

                    <Separator className='my-2' />

                    {/* Additional Images Section */}
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <Label className='text-xs text-muted-foreground'>
                          Additional Images ({additionalImages.length})
                        </Label>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='h-6 text-xs'
                          disabled={isUploadingAdditional[sliderId]}
                          onClick={() => {
                            document.getElementById(`slider-images-${sliderId}`)?.click()
                          }}
                        >
                          {isUploadingAdditional[sliderId] ? (
                            <>
                              <div className='h-3 w-3 mr-1 animate-spin rounded-full border border-primary border-t-transparent'></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Plus className='h-3 w-3 mr-1' />
                              Add Image
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Additional images preview */}
                      {additionalImages.length > 0 && (
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2'>
                          {additionalImages.map((img: MediaFile, imgIndex: number) => (
                            <div key={imgIndex} className='relative group'>
                              <div className='border rounded-md overflow-hidden relative aspect-video'>
                                <Image
                                  src={img.file || '/placeholder.webp'}
                                  alt={`Slider ${index + 1} image ${imgIndex + 1}`}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                              <Button
                                type='button'
                                variant='destructive'
                                className='absolute -top-1 -right-1 size-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
                                onClick={() => {
                                  if (sliderId) {
                                    removeAdditionalImage(sliderId, imgIndex)
                                  }
                                }}
                              >
                                <Trash2 className='size-4' />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Hidden image uploader for additional images */}
                      <div className='hidden'>
                        <ImageUploader
                          id={`slider-images-${sliderId}`}
                          setFile={(file) => {
                            if (sliderId) {
                              handleAdditionalImageUpload(sliderId, file)
                            }
                          }}
                          onStartUpload={() => {
                            if (sliderId) {
                              setIsUploadingAdditional((prev) => ({ ...prev, [sliderId]: true }))
                            }
                          }}
                        />
                      </div>

                      {/* Loading state for additional images */}
                      {isUploadingAdditional[sliderId] && (
                        <div className='mb-2 p-2 bg-muted/20 rounded-md flex items-center gap-2'>
                          <div className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                          <span className='text-xs text-muted-foreground'>Uploading image...</span>
                        </div>
                      )}

                      {additionalImages.length === 0 && (
                        <div className='text-center py-4 border border-dashed rounded-md bg-muted/20'>
                          <p className='text-xs text-muted-foreground'>
                            No additional images added yet
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Click "Add Image" to upload images
                          </p>
                        </div>
                      )}

                      <p className='text-xs text-muted-foreground'>
                        Upload additional images for the slider (optional). Recommended size:
                        800x600px.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {sliderFields.length === 0 && (
            <div className='text-center py-8 text-muted-foreground border border-dashed rounded-md'>
              <p>No sliders added yet. Click the "Add Slider" button to add one.</p>
            </div>
          )}

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
            <Button type='submit' disabled={isSubmitting} className='cursor-pointer'>
              {isSubmitting ? 'Saving...' : 'Save Sliders'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
