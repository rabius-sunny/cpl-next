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
  data?: Projects
}

// Define the Zod schema for project item validation
const projectItemSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Description is too long' }),
  link: z.string().optional()
})

// Define the Zod schema for project section validation
const projectSectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  subtitle: z
    .string()
    .min(1, { message: 'Subtitle is required' })
    .max(100, { message: 'Subtitle is too long' })
})

// Define the form types
type ProjectItemFormValues = z.infer<typeof projectItemSchema>
type ProjectSectionFormValues = z.infer<typeof projectSectionSchema>

export default function Projects({ data }: TProps) {
  const [projects, setProjects] = useState<Projects>(data || { title: '', subtitle: '', items: [] })
  const [editSectionMode, setEditSectionMode] = useState(false)
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null)
  const [addItemMode, setAddItemMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemBanner, setItemBanner] = useState<MediaFile | undefined>(undefined)
  const [itemImages, setItemImages] = useState<MediaFile[]>([])
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Create form for project item
  const itemForm = useForm<ProjectItemFormValues>({
    resolver: zodResolver(projectItemSchema),
    defaultValues: {
      title: '',
      description: '',
      link: ''
    },
    mode: 'onBlur'
  })

  // Create form for project section
  const sectionForm = useForm<ProjectSectionFormValues>({
    resolver: zodResolver(projectSectionSchema),
    defaultValues: {
      title: projects?.title || '',
      subtitle: projects?.subtitle || ''
    },
    mode: 'onBlur'
  })

  // Reset item form and state
  const resetItemForm = () => {
    itemForm.reset({
      title: '',
      description: '',
      link: ''
    })
    setItemBanner(undefined)
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

  // Begin editing an existing project item
  const handleEditItem = (item: ProjectItem, index: number) => {
    setEditItemIndex(index)
    setItemBanner(item.banner)
    setItemImages(item.images || [])
    setAddItemMode(false)

    itemForm.reset({
      title: item.title || '',
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
        title: projects?.title || '',
        subtitle: projects?.subtitle || ''
      })
    }
    setEditSectionMode(!editSectionMode)
  }

  // Cancel editing section
  const handleCancelEditSection = () => {
    setEditSectionMode(false)
  }

  // Delete a project item
  const handleDeleteItem = async (index: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    const newItems = [...(projects.items || [])]
    newItems.splice(index, 1)

    try {
      setIsSubmitting(true)
      const result = await updateOthersContent({
        projects: {
          ...projects,
          items: newItems
        }
      })

      if (result.success) {
        setProjects({
          ...projects,
          items: newItems
        })
        toast.success('Project deleted successfully')
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit handler for project item form
  const onItemSubmit = async (values: ProjectItemFormValues) => {
    if (!itemBanner) {
      setError('Project banner is required')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      // Prepare item data
      const itemData: ProjectItem = {
        ...values,
        banner: itemBanner,
        images: itemImages
      }

      let newItems: ProjectItem[]

      if (editItemIndex !== null) {
        // Update existing item
        newItems = [...(projects.items || [])]
        newItems[editItemIndex] = itemData
      } else {
        // Add new item
        newItems = [...(projects.items || []), itemData]
      }

      // Call the server action to update projects
      const result = await updateOthersContent({
        projects: {
          ...projects,
          items: newItems
        }
      })

      if (result.success) {
        // Update state
        setProjects({
          ...projects,
          items: newItems
        })

        // Reset form
        resetItemForm()

        // Show success toast
        toast.success(
          editItemIndex !== null ? 'Project updated successfully' : 'Project added successfully'
        )
      } else {
        setError('An error occurred while saving the project')
      }
    } catch (err) {
      console.error('Error saving project:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit handler for project section form
  const onSectionSubmit = async (values: ProjectSectionFormValues) => {
    setIsSubmitting(true)

    try {
      // Call the server action to update project section
      const result = await updateOthersContent({
        projects: {
          ...projects,
          title: values.title,
          subtitle: values.subtitle
        }
      })

      if (result.success) {
        // Update state
        setProjects({
          ...projects,
          title: values.title,
          subtitle: values.subtitle
        })

        // Exit edit mode
        setEditSectionMode(false)

        // Show success toast
        toast.success('Projects section updated successfully')
      } else {
        setError('An error occurred while saving the projects section')
      }
    } catch (err) {
      console.error('Error saving projects section:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center my-5'>
        <h1 className='text-lg font-semibold lg:text-3xl'>Projects Management</h1>
        <div className='flex gap-3'>
          {!editSectionMode && (
            <Button onClick={handleToggleEditSection} variant='outline'>
              Edit Section Details
            </Button>
          )}
          {!addItemMode && editItemIndex === null && (
            <Button onClick={handleAddItem} className='flex items-center gap-2'>
              <Plus size={16} /> Add Project
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

                {/* Subtitle field */}
                <FormField
                  control={sectionForm.control}
                  name='subtitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter section subTitle' {...field} />
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
                <p className='text-base'>{projects.title || 'Not set'}</p>
              </div>
              <div>
                <h3 className='text-sm font-semibold text-muted-foreground'>Section Subtitle</h3>
                <p className='text-base'>{projects.subtitle || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add New Item Form */}
      {addItemMode && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
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
                            <Input placeholder='Enter project title' {...field} />
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
                          <FormLabel>Link URL (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter project link URL' {...field} />
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
                            <Textarea placeholder='Enter project description' {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Item Banner and Images Upload */}
                  <div className='space-y-4'>
                    {/* Banner Upload */}
                    <div className='space-y-2'>
                      <FormLabel>Project Banner (Required)</FormLabel>

                      {/* Banner preview */}
                      {itemBanner?.file && (
                        <div className='mb-4 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                            <Image
                              src={itemBanner.file}
                              alt='Project banner preview'
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='text-xs text-muted-foreground mt-1'>Project banner</p>
                        </div>
                      )}

                      {/* Banner uploader component */}
                      <ImageUploader
                        fileId={itemBanner?.fileId}
                        setFile={(file) => setItemBanner(file)}
                      />
                      <p className='text-xs text-muted-foreground'>
                        Upload a banner image for the project. Recommended size: 1200x800px.
                      </p>
                    </div>

                    {/* Additional Images Upload */}
                    <div className='space-y-2 mt-4'>
                      <FormLabel>Additional Images (Optional)</FormLabel>

                      {/* Images preview */}
                      {itemImages.length > 0 && (
                        <div className='grid grid-cols-2 gap-2 mb-4'>
                          {itemImages.map((img, idx) => (
                            <div key={idx} className='relative max-w-xs'>
                              <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                                <Image
                                  src={img.file || ''}
                                  alt={`Project image ${idx + 1}`}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                className='absolute top-1 right-1'
                                onClick={() => {
                                  const newImages = [...itemImages]
                                  newImages.splice(idx, 1)
                                  setItemImages(newImages)
                                }}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add more images button */}
                      <div className='flex flex-col gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          className='flex items-center gap-1 w-full justify-center'
                          disabled={isUploadingImage || itemImages.length >= 5}
                          onClick={() =>
                            document.getElementById('addProjectImageUploader')?.click()
                          }
                        >
                          <Plus size={16} />
                          Add More Images {itemImages.length > 0 ? `(${itemImages.length}/5)` : ''}
                        </Button>

                        <div className='flex items-center gap-2'>
                          <div className='hidden'>
                            <ImageUploader
                              id='addProjectImageUploader'
                              onStartUpload={() => setIsUploadingImage(true)}
                              setFile={(file) => {
                                if (file) {
                                  setIsUploadingImage(false)
                                  setItemImages([...itemImages, file])
                                }
                              }}
                            />
                          </div>
                          {isUploadingImage && (
                            <div className='flex items-center gap-2'>
                              <span className='animate-spin'>⟳</span>
                              <span>Uploading image...</span>
                            </div>
                          )}
                        </div>

                        <p className='text-xs text-muted-foreground'>
                          Upload additional images for the project. Maximum 5 images.
                        </p>
                        {itemImages.length >= 5 && (
                          <p className='text-xs text-red-500'>
                            Maximum number of images reached (5)
                          </p>
                        )}
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
              {isSubmitting ? 'Saving...' : 'Add Project'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Item Form - Same style as Add Item */}
      {editItemIndex !== null && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
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
                            <Input placeholder='Enter project title' {...field} />
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
                          <FormLabel>Link URL (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter project link URL' {...field} />
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
                            <Textarea placeholder='Enter project description' {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Item Banner and Images Upload */}
                  <div className='space-y-4'>
                    {/* Banner Upload */}
                    <div className='space-y-2'>
                      <FormLabel>Project Banner (Required)</FormLabel>

                      {/* Banner preview */}
                      {itemBanner?.file && (
                        <div className='mb-4 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                            <Image
                              src={itemBanner.file}
                              alt='Project banner preview'
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='text-xs text-muted-foreground mt-1'>Project banner</p>
                        </div>
                      )}

                      {/* Banner uploader component */}
                      <ImageUploader
                        fileId={itemBanner?.fileId}
                        setFile={(file) => setItemBanner(file)}
                      />
                      <p className='text-xs text-muted-foreground'>
                        Upload a banner image for the project. Recommended size: 1200x800px.
                      </p>
                    </div>

                    {/* Additional Images Upload */}
                    <div className='space-y-2 mt-4'>
                      <FormLabel>Additional Images (Optional)</FormLabel>

                      {/* Images preview */}
                      {itemImages.length > 0 && (
                        <div className='grid grid-cols-2 gap-2 mb-4'>
                          {itemImages.map((img, idx) => (
                            <div key={idx} className='relative max-w-xs'>
                              <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                                <Image
                                  src={img.file || ''}
                                  alt={`Project image ${idx + 1}`}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                className='absolute top-1 right-1'
                                onClick={() => {
                                  const newImages = [...itemImages]
                                  newImages.splice(idx, 1)
                                  setItemImages(newImages)
                                }}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add more images button */}
                      <div className='flex flex-col gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          className='flex items-center gap-1 w-full justify-center'
                          disabled={isUploadingImage || itemImages.length >= 5}
                          onClick={() =>
                            document.getElementById('editProjectImageUploader')?.click()
                          }
                        >
                          <Plus size={16} />
                          Add More Images {itemImages.length > 0 ? `(${itemImages.length}/5)` : ''}
                        </Button>

                        <div className='flex items-center gap-2'>
                          <div className='hidden'>
                            <ImageUploader
                              id='editProjectImageUploader'
                              onStartUpload={() => setIsUploadingImage(true)}
                              setFile={(file) => {
                                if (file) {
                                  setIsUploadingImage(false)
                                  setItemImages([...itemImages, file])
                                }
                              }}
                            />
                          </div>
                          {isUploadingImage && (
                            <div className='flex items-center gap-2'>
                              <span className='animate-spin'>⟳</span>
                              <span>Uploading image...</span>
                            </div>
                          )}
                        </div>

                        <p className='text-xs text-muted-foreground'>
                          Upload additional images for the project. Maximum 5 images.
                        </p>
                        {itemImages.length >= 5 && (
                          <p className='text-xs text-red-500'>
                            Maximum number of images reached (5)
                          </p>
                        )}
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
              {isSubmitting ? 'Saving...' : 'Update Project'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* List all project items */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
        {(projects.items?.length === 0 || !projects.items) &&
        !addItemMode &&
        editItemIndex === null ? (
          <p className='text-muted-foreground col-span-full text-center py-10'>
            No projects added yet. Click "Add Project" to create your first project.
          </p>
        ) : (
          projects.items?.map((item, index) => (
            <Card key={index} className='overflow-hidden'>
              {item.banner?.file && (
                <div className='relative w-full h-48'>
                  <Image
                    src={item.banner.file}
                    alt={item.title || 'Project banner'}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <p className='px-2 text-lg'>{item.title}</p>
              {item.link && (
                <p className='px-2 text-sm text-blue-500 hover:underline'>
                  <a href={item.link} target='_blank' rel='noopener noreferrer'>
                    {item.link}
                  </a>
                </p>
              )}
              <p className='px-2 text-sm line-clamp-3'>{item.description}</p>
              <div className='flex justify-end gap-2 px-2'>
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
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
