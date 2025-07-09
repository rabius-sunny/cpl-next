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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
  direction: z.enum(['vertical', 'horizontal']).optional(),
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
          direction: slider.direction || 'horizontal',
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
      direction: 'horizontal',
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
          direction: slider.direction,
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
        <h1 className='font-semibold text-lg lg:text-2xl'>Sliders Management</h1>
        <Button
          type='button'
          onClick={addSlider}
          variant='default'
          size='sm'
          className='cursor-pointer'
        >
          <Plus className='mr-2 w-4 h-4' />
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
                        className='bg-red-100 hover:bg-destructive size-7 text-destructive hover:text-white cursor-pointer'
                        disabled={sliderFields.length <= 1}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-3 p-0'>
                    {/* Basic Fields */}
                    <div className='gap-3 grid md:grid-cols-3'>
                      {/* Title field */}
                      <FormField
                        control={form.control}
                        name={`sliders.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-muted-foreground text-xs'>Title</FormLabel>
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
                            <FormLabel className='text-muted-foreground text-xs'>
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

                      {/* Direction field */}
                      <FormField
                        control={form.control}
                        name={`sliders.${index}.direction`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-muted-foreground text-xs'>
                              Direction
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='h-7 text-sm'>
                                  <SelectValue placeholder='Select direction' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='horizontal'>Horizontal</SelectItem>
                                <SelectItem value='vertical'>Vertical</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className='my-2' />

                    {/* Background Image Section */}
                    <div className='space-y-2'>
                      <Label className='text-muted-foreground text-xs'>Background Image</Label>

                      {/* Background image preview */}
                      {backgroundImage?.file && (
                        <div className='relative mb-3 max-w-xs'>
                          <div className='relative border rounded-md w-full aspect-video overflow-hidden'>
                            <Image
                              src={backgroundImage.file || '/placeholder.webp'}
                              alt={`Slider ${index + 1} background`}
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='mt-1 text-muted-foreground text-xs'>Background image.</p>
                        </div>
                      )}

                      {/* Loading state for background image */}
                      {isUploadingBackground[sliderId] && (
                        <div className='flex items-center gap-2 bg-muted/20 mb-2 p-2 rounded-md'>
                          <div className='border-2 border-primary border-t-transparent rounded-full w-3 h-3 animate-spin'></div>
                          <span className='text-muted-foreground text-xs'>
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
                      <p className='text-muted-foreground text-xs'>
                        Upload a background image for the slider. Recommended size: 1920x1080px.
                      </p>
                    </div>

                    <Separator className='my-2' />

                    {/* Additional Images Section */}
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <Label className='text-muted-foreground text-xs'>
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
                              <div className='mr-1 border border-primary border-t-transparent rounded-full w-3 h-3 animate-spin'></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Plus className='mr-1 w-3 h-3' />
                              Add Image
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Additional images preview */}
                      {additionalImages.length > 0 && (
                        <div className='gap-2 grid grid-cols-2 sm:grid-cols-3 mb-2'>
                          {additionalImages.map((img: MediaFile, imgIndex: number) => (
                            <div key={imgIndex} className='group relative'>
                              <div className='relative border rounded-md aspect-video overflow-hidden'>
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
                                className='-top-1 -right-1 absolute opacity-0 group-hover:opacity-100 p-0 size-6 transition-opacity'
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
                        <div className='flex items-center gap-2 bg-muted/20 mb-2 p-2 rounded-md'>
                          <div className='border-2 border-primary border-t-transparent rounded-full w-3 h-3 animate-spin'></div>
                          <span className='text-muted-foreground text-xs'>Uploading image...</span>
                        </div>
                      )}

                      {additionalImages.length === 0 && (
                        <div className='bg-muted/20 py-4 border border-dashed rounded-md text-center'>
                          <p className='text-muted-foreground text-xs'>
                            No additional images added yet
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            Click "Add Image" to upload images
                          </p>
                        </div>
                      )}

                      <p className='text-muted-foreground text-xs'>
                        Upload additional images for the slider (optional). Recommended size:
                        800x600px. <br />
                        <span className='text-red-500'><b>N.B.</b> All layered images must maintain the same size and aspect ratio.</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {sliderFields.length === 0 && (
            <div className='py-8 border border-dashed rounded-md text-muted-foreground text-center'>
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
