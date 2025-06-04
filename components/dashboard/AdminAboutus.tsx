'use client'

import {
  addLeader,
  addSection,
  deleteLeader,
  deleteSection,
  reorderSections,
  updateBasicAboutus,
  updateLeader,
  updateSection
} from '@/actions/data/aboutus'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, MoveDown, MoveUp, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: Aboutus | null
}

// Define section schema for validation
const sectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title is too long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(2000, { message: 'Description is too long' }),
  _id: z.string().optional() // For React key management
})

// Define leader schema for validation
const leaderSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  designation: z
    .string()
    .min(1, { message: 'Designation is required' })
    .max(100, { message: 'Designation is too long' }),
  bio: z.string().min(1, { message: 'Bio is required' }).max(2000, { message: 'Bio is too long' }),
  _id: z.string().optional() // For React key management
})

// Define the main About Us schema
const aboutusSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title is too long' }),
  sections: z.array(sectionSchema).optional(),
  leadership: z.object({
    title: z
      .string()
      .min(1, { message: 'Leadership title is required' })
      .max(200, { message: 'Title is too long' }),
    description: z
      .string()
      .min(1, { message: 'Leadership description is required' })
      .max(2000, { message: 'Description is too long' }),
    leaders: z.array(leaderSchema).optional()
  })
})

// Define section form schema for modal
const sectionFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title is too long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(2000, { message: 'Description is too long' })
})

// Define leader form schema for modal
const leaderFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  designation: z
    .string()
    .min(1, { message: 'Designation is required' })
    .max(100, { message: 'Designation is too long' }),
  bio: z.string().min(1, { message: 'Bio is required' }).max(2000, { message: 'Bio is too long' })
})

type AboutusFormValues = z.infer<typeof aboutusSchema>
type SectionFormValues = z.infer<typeof sectionFormSchema>
type LeaderFormValues = z.infer<typeof leaderFormSchema>

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

export default function AdminAboutus({ data }: TProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Image states
  const [backgroundImage, setBackgroundImage] = useState<MediaFile | undefined>()
  const [sectionImages, setSectionImages] = useState<(MediaFile | undefined)[]>([])
  const [bottomImage, setBottomImage] = useState<MediaFile | undefined>()

  // Modal states
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [leaderModalOpen, setLeaderModalOpen] = useState(false)
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)
  const [editingLeaderIndex, setEditingLeaderIndex] = useState<number | null>(null)
  const [isSectionSubmitting, setIsSectionSubmitting] = useState(false)
  const [isLeaderSubmitting, setIsLeaderSubmitting] = useState(false)
  const [currentSectionImage, setCurrentSectionImage] = useState<MediaFile | undefined>()

  // Main form setup
  const form = useForm<AboutusFormValues>({
    resolver: zodResolver(aboutusSchema),
    defaultValues: {
      title: '',
      sections: [],
      leadership: { title: '', description: '', leaders: [] }
    }
  })

  // Section form setup for modal
  const sectionForm = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  // Leader form setup for modal
  const leaderForm = useForm<LeaderFormValues>({
    resolver: zodResolver(leaderFormSchema),
    defaultValues: {
      name: '',
      designation: '',
      bio: ''
    }
  })

  // Field arrays
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
    update: updateSectionField,
    move: moveSection
  } = useFieldArray({
    control: form.control,
    name: 'sections'
  })

  const {
    fields: leaderFields,
    append: appendLeader,
    remove: removeLeader,
    update: updateLeaderField
  } = useFieldArray({
    control: form.control,
    name: 'leadership.leaders'
  })

  // Initialize form with props data
  useEffect(() => {
    if (data) {
      // Set form values
      form.reset({
        title: data.title || '',
        sections:
          data.sections?.map((section: any) => ({
            ...section,
            _id: generateId()
          })) || [],
        leadership: {
          title: data.leadership?.title || '',
          description: data.leadership?.description || '',
          leaders:
            data.leadership?.leaders?.map((leader: any) => ({
              ...leader,
              _id: generateId()
            })) || []
        }
      })

      // Set image states
      setBackgroundImage(data.backgroundImage)
      setSectionImages(data.sections?.map((section: any) => section.image) || [])
      setBottomImage(data.bottomImage)
    }
  }, [data, form])

  // Handle main form submission (only basic fields now)
  const onSubmit = async (values: AboutusFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Only submit basic fields - sections and leaders are handled immediately
      const basicData = {
        title: values.title,
        backgroundImage: backgroundImage
          ? {
              file: backgroundImage.file || '',
              fileId: backgroundImage.fileId || '',
              thumbnail: backgroundImage.thumbnail || ''
            }
          : undefined,
        leadership: {
          title: values.leadership.title,
          description: values.leadership.description
        },
        bottomImage: bottomImage
          ? {
              file: bottomImage.file || '',
              fileId: bottomImage.fileId || '',
              thumbnail: bottomImage.thumbnail || ''
            }
          : undefined
      }

      const result = await updateBasicAboutus(basicData)

      if (result.success) {
        toast.success('Basic information updated successfully')
      } else {
        setError(result.error || 'Failed to update basic information')
        toast.error(result.error || 'Failed to update basic information')
      }
    } catch (err) {
      console.error('Error updating basic information:', err)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Section management functions
  const handleAddSection = () => {
    setEditingSectionIndex(null)
    setCurrentSectionImage(undefined)
    sectionForm.reset({ title: '', description: '' })
    setSectionModalOpen(true)
  }

  const handleEditSection = (index: number) => {
    const section = sectionFields[index]
    setEditingSectionIndex(index)
    setCurrentSectionImage(sectionImages[index])
    sectionForm.reset({
      title: section.title,
      description: section.description
    })
    setSectionModalOpen(true)
  }

  const onSectionSubmit = async (values: SectionFormValues) => {
    setIsSectionSubmitting(true)

    try {
      const sectionData = {
        title: values.title,
        description: values.description,
        image: currentSectionImage
          ? {
              file: currentSectionImage.file || '',
              fileId: currentSectionImage.fileId || '',
              thumbnail: currentSectionImage.thumbnail || ''
            }
          : undefined
      }

      let result
      if (editingSectionIndex !== null) {
        // Update existing section via server action
        result = await updateSection(editingSectionIndex, sectionData)

        if (result.success) {
          // Update local state to reflect changes
          updateSectionField(editingSectionIndex, {
            ...values,
            _id: sectionFields[editingSectionIndex]._id
          })

          // Update section image
          const newSectionImages = [...sectionImages]
          newSectionImages[editingSectionIndex] = currentSectionImage
          setSectionImages(newSectionImages)

          toast.success('Section updated successfully')
        }
      } else {
        // Add new section via server action
        result = await addSection(sectionData)

        if (result.success) {
          // Update local state to reflect changes
          appendSection({
            ...values,
            _id: generateId()
          })

          // Add section image
          setSectionImages([...sectionImages, currentSectionImage])

          toast.success('Section added successfully')
        }
      }

      if (!result.success) {
        toast.error(result.error || 'Failed to save section')
        return
      }

      setSectionModalOpen(false)
      sectionForm.reset()
      setEditingSectionIndex(null)
      setCurrentSectionImage(undefined)
    } catch (err) {
      console.error('Error saving section:', err)
      toast.error('Failed to save section')
    } finally {
      setIsSectionSubmitting(false)
    }
  }

  const handleDeleteSection = async (index: number) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return

    try {
      const result = await deleteSection(index)

      if (result.success) {
        // Update local state
        removeSection(index)
        const newSectionImages = [...sectionImages]
        newSectionImages.splice(index, 1)
        setSectionImages(newSectionImages)
        toast.success('Section deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete section')
      }
    } catch (err) {
      console.error('Error deleting section:', err)
      toast.error('Failed to delete section')
    }
  }

  const handleMoveSectionUp = async (index: number) => {
    if (index > 0) {
      try {
        const result = await reorderSections(index, index - 1)

        if (result.success) {
          // Update local state
          moveSection(index, index - 1)
          const newSectionImages = [...sectionImages]
          const temp = newSectionImages[index]
          newSectionImages[index] = newSectionImages[index - 1]
          newSectionImages[index - 1] = temp
          setSectionImages(newSectionImages)
          toast.success('Section moved up successfully')
        } else {
          toast.error(result.error || 'Failed to move section')
        }
      } catch (err) {
        console.error('Error moving section up:', err)
        toast.error('Failed to move section')
      }
    }
  }

  const handleMoveSectionDown = async (index: number) => {
    if (index < sectionFields.length - 1) {
      try {
        const result = await reorderSections(index, index + 1)

        if (result.success) {
          // Update local state
          moveSection(index, index + 1)
          const newSectionImages = [...sectionImages]
          const temp = newSectionImages[index]
          newSectionImages[index] = newSectionImages[index + 1]
          newSectionImages[index + 1] = temp
          setSectionImages(newSectionImages)
          toast.success('Section moved down successfully')
        } else {
          toast.error(result.error || 'Failed to move section')
        }
      } catch (err) {
        console.error('Error moving section down:', err)
        toast.error('Failed to move section')
      }
    }
  }

  // Leader management functions
  const handleAddLeader = () => {
    setEditingLeaderIndex(null)
    leaderForm.reset({ name: '', designation: '', bio: '' })
    setLeaderModalOpen(true)
  }

  const handleEditLeader = (index: number) => {
    const leader = leaderFields[index]
    setEditingLeaderIndex(index)
    leaderForm.reset({
      name: leader.name,
      designation: leader.designation,
      bio: leader.bio
    })
    setLeaderModalOpen(true)
  }

  const onLeaderSubmit = async (values: LeaderFormValues) => {
    setIsLeaderSubmitting(true)

    try {
      let result
      if (editingLeaderIndex !== null) {
        // Update existing leader via server action
        result = await updateLeader(editingLeaderIndex, values)

        if (result.success) {
          // Update local state
          updateLeaderField(editingLeaderIndex, {
            ...values,
            _id: leaderFields[editingLeaderIndex]._id
          })
          toast.success('Leader updated successfully')
        }
      } else {
        // Add new leader via server action
        result = await addLeader(values)

        if (result.success) {
          // Update local state
          appendLeader({
            ...values,
            _id: generateId()
          })
          toast.success('Leader added successfully')
        }
      }

      if (!result.success) {
        toast.error(result.error || 'Failed to save leader')
        return
      }

      setLeaderModalOpen(false)
      leaderForm.reset()
      setEditingLeaderIndex(null)
    } catch (err) {
      console.error('Error saving leader:', err)
      toast.error('Failed to save leader')
    } finally {
      setIsLeaderSubmitting(false)
    }
  }

  const handleDeleteLeader = async (index: number) => {
    if (!window.confirm('Are you sure you want to delete this leader?')) return

    try {
      const result = await deleteLeader(index)

      if (result.success) {
        // Update local state
        removeLeader(index)
        toast.success('Leader deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete leader')
      }
    } catch (err) {
      console.error('Error deleting leader:', err)
      toast.error('Failed to delete leader')
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>About Us Management</h1>
          <p className='text-muted-foreground'>Manage your organization's about us content</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {error && <FormError message={error} />}

          {/* Main Title Section */}
          <Card>
            <CardHeader>
              <CardTitle>Main Title</CardTitle>
              <CardDescription>The main title for your about us page</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl>
                      <Input placeholder='About Our Company' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-2'>
                <FormLabel>Background Image</FormLabel>
                {backgroundImage?.file && (
                  <div className='mb-4 relative max-w-xs'>
                    <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                      <Image
                        src={backgroundImage.file || '/placeholder.webp'}
                        alt='Background image preview'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>Background image</p>
                  </div>
                )}
                <ImageUploader
                  fileId={backgroundImage?.fileId}
                  setFile={(file) => setBackgroundImage(file)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Content Sections</CardTitle>
              <CardDescription>Add multiple content sections to your about us page</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>Sections</h3>
                <Button type='button' onClick={handleAddSection} variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Section
                </Button>
              </div>

              {sectionFields.length > 0 ? (
                <div className='grid gap-4'>
                  {sectionFields.map((section, index) => (
                    <Card key={section._id} className='border-l-4 border-l-blue-500/30'>
                      <CardContent className='p-4'>
                        <div className='flex flex-col lg:flex-row items-start justify-between gap-4'>
                          <div className='flex-1 order-last lg:order-first'>
                            <h4 className='font-medium'>{section.title}</h4>
                            <p className='text-sm mt-2 line-clamp-2'>{section.description}</p>
                            {sectionImages[index]?.file && (
                              <div className='mt-2 relative max-w-[200px]'>
                                <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                                  <Image
                                    src={sectionImages[index]!.file || '/placeholder.webp'}
                                    alt='Section image'
                                    fill
                                    className='object-cover'
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className='flex shadow px-2 rounded-md  gap-2'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleMoveSectionUp(index)}
                              disabled={index === 0}
                            >
                              <MoveUp className='h-4 w-4' />
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleMoveSectionDown(index)}
                              disabled={index === sectionFields.length - 1}
                            >
                              <MoveDown className='h-4 w-4' />
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleEditSection(index)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleDeleteSection(index)}
                              className='text-destructive hover:text-destructive'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8 border border-dashed rounded-md'>
                  <p className='text-muted-foreground'>No sections added yet</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Click "Add Section" to add content sections
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leadership Section */}
          <Card>
            <CardHeader>
              <CardTitle>Leadership Section</CardTitle>
              <CardDescription>Information about your company's leadership team</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='leadership.title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leadership Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Our Leadership' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='leadership.description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leadership Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Introduce your leadership team...'
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Leaders Management */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium'>Leadership Team</h3>
                  <Button type='button' onClick={handleAddLeader} variant='outline' size='sm'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Leader
                  </Button>
                </div>

                {leaderFields.length > 0 ? (
                  <div className='grid gap-4'>
                    {leaderFields.map((leader, index) => (
                      <Card key={leader._id} className='border-l-4 border-l-primary/30'>
                        <CardContent className='p-4'>
                          <div className='flex items-start justify-between gap-4'>
                            <div className='flex-1'>
                              <h4 className='font-medium'>{leader.name}</h4>
                              <p className='text-sm text-muted-foreground'>{leader.designation}</p>
                              <p className='text-sm mt-2 line-clamp-2'>{leader.bio}</p>
                            </div>
                            <div className='flex gap-2'>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => handleEditLeader(index)}
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => handleDeleteLeader(index)}
                                className='text-destructive hover:text-destructive'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8 border border-dashed rounded-md'>
                    <p className='text-muted-foreground'>No leaders added yet</p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Click "Add Leader" to add leadership team members
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Bottom Image</CardTitle>
              <CardDescription>
                An image displayed at the bottom of the about us page
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <FormLabel>Bottom Image</FormLabel>
                {bottomImage?.file && (
                  <div className='mb-4 relative max-w-xs'>
                    <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                      <Image
                        src={bottomImage.file || '/placeholder.webp'}
                        alt='Bottom image preview'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>Bottom section image</p>
                  </div>
                )}
                <ImageUploader
                  fileId={bottomImage?.fileId}
                  setFile={(file) => setBottomImage(file)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className='flex flex-col lg:flex-row gap-3 lg:gap-0 justify-start mb-10'>
            <Button type='submit' disabled={isSubmitting} size='lg'>
              {isSubmitting ? 'Saving...' : 'Save Basic Information'}
            </Button>
            <p className='text-sm text-muted-foreground ml-4 self-center'>
              Sections and leaders are saved automatically when added/edited
            </p>
          </div>
        </form>
      </Form>

      {/* Section Modal */}
      <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
        <DialogContent className='max-w-lg max-h-[500px] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editingSectionIndex !== null ? 'Edit Section' : 'Add New Section'}
            </DialogTitle>
            <DialogDescription>
              {editingSectionIndex !== null
                ? 'Update the section information'
                : 'Add a new content section to your about us page'}
            </DialogDescription>
          </DialogHeader>

          <Form {...sectionForm}>
            <form onSubmit={sectionForm.handleSubmit(onSectionSubmit)} className='space-y-4'>
              <FormField
                control={sectionForm.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Our History' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={sectionForm.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe this section...'
                        className='min-h-[120px] max-h-[200px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-2'>
                <FormLabel>Section Image (Optional)</FormLabel>
                {currentSectionImage?.file && (
                  <div className='mb-4 relative max-w-xs'>
                    <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                      <Image
                        src={currentSectionImage.file || '/placeholder.webp'}
                        alt='Section image preview'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>Section image</p>
                  </div>
                )}
                <ImageUploader
                  fileId={currentSectionImage?.fileId}
                  setFile={(file) => setCurrentSectionImage(file)}
                />
              </div>

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setSectionModalOpen(false)}
                  disabled={isSectionSubmitting}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isSectionSubmitting}>
                  {isSectionSubmitting
                    ? 'Saving...'
                    : editingSectionIndex !== null
                      ? 'Update'
                      : 'Add'}{' '}
                  Section
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Leader Modal */}
      <Dialog open={leaderModalOpen} onOpenChange={setLeaderModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editingLeaderIndex !== null ? 'Edit Leader' : 'Add New Leader'}
            </DialogTitle>
            <DialogDescription>
              {editingLeaderIndex !== null
                ? 'Update the leader information'
                : 'Add a new leader to your leadership team'}
            </DialogDescription>
          </DialogHeader>

          <Form {...leaderForm}>
            <form onSubmit={leaderForm.handleSubmit(onLeaderSubmit)} className='space-y-4'>
              <FormField
                control={leaderForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={leaderForm.control}
                name='designation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder='CEO & Founder' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={leaderForm.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief biography and background...'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setLeaderModalOpen(false)}
                  disabled={isLeaderSubmitting}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isLeaderSubmitting}>
                  {isLeaderSubmitting
                    ? 'Saving...'
                    : editingLeaderIndex !== null
                      ? 'Update'
                      : 'Add'}{' '}
                  Leader
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
