'use client'

import { updateOthersContent } from '@/actions/data/others-content'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: Services
}

// Define the Zod schema for service item validation
const serviceItemSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  subTitle: z.string().max(100, { message: 'Subtitle is too long' }).optional(),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Description is too long' }),
  link: z.string().optional()
})

// Define the Zod schema for service section validation
const serviceSectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description is too long' })
})

// Define the form types
type ServiceItemFormValues = z.infer<typeof serviceItemSchema>
type ServiceSectionFormValues = z.infer<typeof serviceSectionSchema>

export default function Services({ data }: TProps) {
  const [services, setServices] = useState<Services>(
    data || { title: '', description: '', items: [] }
  )
  const [editSectionMode, setEditSectionMode] = useState(false)
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null)
  const [addItemMode, setAddItemMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bannerImage, setBannerImage] = useState<MediaFile | undefined>(undefined)
  const [itemImages, setItemImages] = useState<MediaFile[]>([])
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Create form for service item
  const itemForm = useForm<ServiceItemFormValues>({
    resolver: zodResolver(serviceItemSchema),
    defaultValues: {
      title: '',
      subTitle: '',
      description: '',
      link: ''
    },
    mode: 'onSubmit'
  })

  // Create form for service section
  const sectionForm = useForm<ServiceSectionFormValues>({
    resolver: zodResolver(serviceSectionSchema),
    defaultValues: {
      title: services?.title || '',
      description: services?.description || ''
    },
    mode: 'onSubmit'
  })

  // Reset item form and state
  const resetItemForm = () => {
    itemForm.reset({
      title: '',
      subTitle: '',
      description: '',
      link: ''
    })
    setBannerImage(undefined)
    setItemImages([])
    setEditItemIndex(null)
    setAddItemMode(false)
    setError(null)
  }

  // Toggle add item mode
  const handleAddItem = () => {
    resetItemForm()
    setAddItemMode(true)
  }

  // Begin editing an existing service item
  const handleEditItem = (item: ServiceItem, index: number) => {
    setEditItemIndex(index)
    setBannerImage(item.banner)
    setItemImages(item.images || [])
    setAddItemMode(false)

    itemForm.reset({
      title: item.title || '',
      subTitle: item.subTitle || '',
      description: item.description || '',
      link: item.link || ''
    })
  }

  // Cancel editing an item
  const handleCancelEditItem = () => {
    resetItemForm()
  }

  // Toggle edit mode for section details
  const handleToggleEditSection = () => {
    if (!editSectionMode) {
      sectionForm.reset({
        title: services?.title || '',
        description: services?.description || ''
      })
    }
    setEditSectionMode(!editSectionMode)
  }

  // Cancel editing section
  const handleCancelEditSection = () => {
    setEditSectionMode(false)
  }

  // Delete a service item
  const handleDeleteItem = async (index: number) => {
    if (!confirm('Are you sure you want to delete this service item?')) return

    const newItems = [...(services.items || [])]
    newItems.splice(index, 1)

    try {
      setIsSubmitting(true)
      const result = await updateOthersContent({
        services: {
          ...services,
          items: newItems
        }
      })

      if (result.success) {
        setServices({
          ...services,
          items: newItems
        })
        toast.success('Service item deleted successfully')
      } else {
        toast.error('Failed to delete service item')
      }
    } catch (error) {
      console.error('Error deleting service item:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add an image to the images array
  const handleAddImage = (image: MediaFile) => {
    setIsUploadingImage(false)
    if (image && image.file) {
      setItemImages((prev) => [...prev, image])
    }
  }

  // Handle start of image upload
  const handleStartImageUpload = () => {
    setIsUploadingImage(true)
  }

  // Remove an image from the images array
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...itemImages]
    updatedImages.splice(index, 1)
    setItemImages(updatedImages)
  }

  // Submit handler for service item form
  const onItemSubmit = async (values: ServiceItemFormValues) => {
    if (!bannerImage) {
      setError('Banner image is required')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      // Prepare item data
      const itemData: ServiceItem = {
        ...values,
        banner: bannerImage,
        images: itemImages.length > 0 ? [...itemImages] : undefined
      }

      let newItems: ServiceItem[] = [...(services.items || [])]

      if (editItemIndex !== null) {
        // Update existing item
        newItems[editItemIndex] = itemData
      } else {
        // Add new item
        newItems.push(itemData)
      }

      // Call the server action to update services
      const result = await updateOthersContent({
        services: {
          ...services,
          items: newItems
        }
      })

      if (result.success) {
        // Update state
        setServices({
          ...services,
          items: newItems
        })

        // Reset form
        resetItemForm()

        // Show success toast
        toast.success(
          editItemIndex !== null
            ? 'Service item updated successfully'
            : 'Service item added successfully'
        )
      } else {
        setError('An error occurred while saving the service item')
      }
    } catch (err) {
      console.error('Error saving service item:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit handler for service section form
  const onSectionSubmit = async (values: ServiceSectionFormValues) => {
    setIsSubmitting(true)

    try {
      // Call the server action to update service section
      const result = await updateOthersContent({
        services: {
          ...services,
          title: values.title,
          description: values.description
        }
      })

      if (result.success) {
        // Update state
        setServices({
          ...services,
          title: values.title,
          description: values.description
        })

        // Exit edit mode
        setEditSectionMode(false)

        // Show success toast
        toast.success('Services section updated successfully')
      } else {
        setError('An error occurred while saving the services section')
      }
    } catch (err) {
      console.error('Error saving services section:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center my-5'>
        <h1 className='text-lg font-semibold lg:text-3xl'>Services Management</h1>
        <div className='flex gap-3'>
          {!editSectionMode && (
            <Button onClick={handleToggleEditSection} variant='outline'>
              Edit Section Details
            </Button>
          )}
          {!addItemMode && editItemIndex === null && (
            <Button onClick={handleAddItem} className='flex items-center gap-2'>
              <Plus size={16} /> Add Service
            </Button>
          )}
        </div>
      </div>

      {/* Section Information Card */}
      <Card className='mb-6'>
        {editSectionMode ? (
          <CardContent className='p-4'>
            <Form {...sectionForm}>
              <form onSubmit={sectionForm.handleSubmit(onSectionSubmit)} className='space-y-4'>
                {error && <FormError message={error} />}

                {/* Title field */}
                <FormField
                  control={sectionForm.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter section title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description field */}
                <FormField
                  control={sectionForm.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Enter section description' {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleCancelEditSection}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        ) : (
          <CardContent className='p-4'>
            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-semibold text-muted-foreground'>Section Title</h3>
                <p className='text-base'>{services.title || 'Not set'}</p>
              </div>
              <div>
                <h3 className='text-sm font-semibold text-muted-foreground'>Section Description</h3>
                <p className='text-base'>{services.description || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add New Item Form */}
      {addItemMode && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...itemForm}>
              <form
                id='addItemForm'
                onSubmit={itemForm.handleSubmit(onItemSubmit)}
                className='space-y-4'
              >
                {error && <FormError message={error} />}

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    {/* Title field */}
                    <FormField
                      control={itemForm.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter service title' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subtitle field */}
                    <FormField
                      control={itemForm.control}
                      name='subTitle'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtitle</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter service subtitle (optional)' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description field */}
                    <FormField
                      control={itemForm.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder='Enter service description' {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Link field */}
                    <FormField
                      control={itemForm.control}
                      name='link'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='https://example.com' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='space-y-6'>
                    {/* Banner Image Upload */}
                    <div className='space-y-2'>
                      <FormLabel>Banner Image</FormLabel>

                      {/* Image preview */}
                      {bannerImage?.file && (
                        <div className='mb-4 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative h-32 w-full'>
                            <Image
                              src={bannerImage.file}
                              alt='Service banner preview'
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='text-xs text-muted-foreground mt-1'>Banner image</p>
                        </div>
                      )}

                      {/* Image uploader component */}
                      <ImageUploader
                        fileId={bannerImage?.fileId}
                        setFile={(file) => setBannerImage(file)}
                      />
                      <p className='text-xs text-muted-foreground'>
                        Upload a banner image for the service.
                      </p>
                    </div>

                    {/* Additional Images */}
                    <div className='space-y-2'>
                      <FormLabel>Additional Images (Optional)</FormLabel>

                      {/* Images preview */}
                      {itemImages.length > 0 && (
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4'>
                          {itemImages.map((img, idx) => (
                            <div key={idx} className='relative'>
                              <div className='border rounded-md overflow-hidden relative h-20'>
                                {img.file && (
                                  <Image
                                    src={img.file}
                                    alt={`Image ${idx + 1}`}
                                    fill
                                    className='object-cover'
                                  />
                                )}
                              </div>
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                className='absolute top-0 right-0 h-6 w-6 p-0'
                                onClick={() => handleRemoveImage(idx)}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add More Images Button */}
                      <div className='flex flex-col space-y-2'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => {
                            handleStartImageUpload()
                            document.getElementById('add-item-more-images')?.click()
                          }}
                          className='w-full flex items-center justify-center gap-2'
                          disabled={isUploadingImage}
                        >
                          {isUploadingImage ? (
                            <>
                              <span className='animate-spin mr-2 h-4 w-4 rounded-full border-2 border-gray-500 border-t-white'></span>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              {itemImages.length > 0
                                ? 'Add More Images'
                                : 'Upload additional images'}
                            </>
                          )}
                        </Button>

                        {/* Hidden image uploader */}
                        <div className='hidden'>
                          <ImageUploader id='add-item-more-images' setFile={handleAddImage} />
                        </div>

                        <p className='text-xs text-muted-foreground'>
                          Click "Add More Images" to upload additional images for the service
                          (optional).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancelEditItem}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' form='addItemForm' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Service'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Item Form - Same style as Add Item */}
      {editItemIndex !== null && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Edit Service</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...itemForm}>
              <form
                id='editItemForm'
                onSubmit={itemForm.handleSubmit(onItemSubmit)}
                className='space-y-4'
              >
                {error && <FormError message={error} />}

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    {/* Title field */}
                    <FormField
                      control={itemForm.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter service title' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subtitle field */}
                    <FormField
                      control={itemForm.control}
                      name='subTitle'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtitle</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter service subtitle (optional)' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description field */}
                    <FormField
                      control={itemForm.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder='Enter service description' {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Link field */}
                    <FormField
                      control={itemForm.control}
                      name='link'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='https://example.com' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='space-y-6'>
                    {/* Banner Image Upload */}
                    <div className='space-y-2'>
                      <FormLabel>Banner Image</FormLabel>

                      {/* Image preview */}
                      {bannerImage?.file && (
                        <div className='mb-4 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative h-32 w-full'>
                            <Image
                              src={bannerImage.file}
                              alt='Service banner preview'
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='text-xs text-muted-foreground mt-1'>Banner image</p>
                        </div>
                      )}

                      {/* Image uploader component */}
                      <ImageUploader
                        fileId={bannerImage?.fileId}
                        setFile={(file) => setBannerImage(file)}
                      />
                      <p className='text-xs text-muted-foreground'>
                        Upload a banner image for the service.
                      </p>
                    </div>

                    {/* Additional Images */}
                    <div className='space-y-2'>
                      <FormLabel>Additional Images (Optional)</FormLabel>

                      {/* Images preview */}
                      {itemImages.length > 0 && (
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4'>
                          {itemImages.map((img, idx) => (
                            <div key={idx} className='relative'>
                              <div className='border rounded-md overflow-hidden relative h-20'>
                                {img.file && (
                                  <Image
                                    src={img.file}
                                    alt={`Image ${idx + 1}`}
                                    fill
                                    className='object-cover'
                                  />
                                )}
                              </div>
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                className='absolute top-0 right-0 h-6 w-6 p-0'
                                onClick={() => handleRemoveImage(idx)}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add More Images Button */}
                      <div className='flex flex-col space-y-2'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => {
                            handleStartImageUpload()
                            document.getElementById('edit-item-more-images')?.click()
                          }}
                          className='w-full flex items-center justify-center gap-2'
                          disabled={isUploadingImage}
                        >
                          {isUploadingImage ? (
                            <>
                              <span className='animate-spin mr-2 h-4 w-4 rounded-full border-2 border-gray-500 border-t-white'></span>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              {itemImages.length > 0
                                ? 'Add More Images'
                                : 'Upload additional images'}
                            </>
                          )}
                        </Button>

                        {/* Hidden image uploader */}
                        <div className='hidden'>
                          <ImageUploader id='edit-item-more-images' setFile={handleAddImage} />
                        </div>

                        <p className='text-xs text-muted-foreground'>
                          Click "Add More Images" to upload additional images for the service
                          (optional).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancelEditItem}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' form='editItemForm' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Update Service'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* List all service items */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6'>
        {(!services.items || services.items.length === 0) &&
        !addItemMode &&
        editItemIndex === null ? (
          <p className='text-muted-foreground col-span-full text-center py-10'>
            No service items added yet. Click "Add Service" to create your first service item.
          </p>
        ) : (
          services.items?.map((item, index) => (
            <Card key={index} className='overflow-hidden max-w-xs'>
              {item.banner?.file && (
                <div className='relative w-full h-32'>
                  <Image
                    src={item.banner.file}
                    alt={item.title || 'Service item banner'}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div className='p-3'>
                <h3 className='font-semibold truncate'>{item.title}</h3>
                {item.subTitle && <p className='text-sm text-muted-foreground'>{item.subTitle}</p>}
                <p className='text-xs line-clamp-2 mt-1'>{item.description}</p>

                {item.images && item.images.length > 0 && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    {item.images.length} additional {item.images.length === 1 ? 'image' : 'images'}
                  </p>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-blue-500 hover:underline mt-1 block truncate'
                  >
                    {item.link}
                  </a>
                )}

                <div className='flex justify-end gap-2 mt-2'>
                  <Button variant='outline' size='sm' onClick={() => handleEditItem(item, index)}>
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDeleteItem(index)}
                    disabled={isSubmitting}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
