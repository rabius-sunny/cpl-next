'use client'

import { updateAboutus } from '@/actions/data/aboutus'
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
import { Edit, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: Aboutus | null
}

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
  bio: z.string().min(1, { message: 'Bio is required' }).max(500, { message: 'Bio is too long' }),
  _id: z.string().optional() // For React key management
})

// Define the main About Us schema
const aboutusSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title is too long' }),
  history: z.object({
    title: z
      .string()
      .min(1, { message: 'History title is required' })
      .max(200, { message: 'Title is too long' }),
    description: z
      .string()
      .min(1, { message: 'History description is required' })
      .max(1000, { message: 'Description is too long' })
  }),
  mission: z.object({
    title: z
      .string()
      .min(1, { message: 'Mission title is required' })
      .max(200, { message: 'Title is too long' }),
    description: z
      .string()
      .min(1, { message: 'Mission description is required' })
      .max(1000, { message: 'Description is too long' })
  }),
  leadership: z.object({
    title: z
      .string()
      .min(1, { message: 'Leadership title is required' })
      .max(200, { message: 'Title is too long' }),
    description: z
      .string()
      .min(1, { message: 'Leadership description is required' })
      .max(1000, { message: 'Description is too long' }),
    leaders: z.array(leaderSchema).optional()
  })
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
  bio: z.string().min(1, { message: 'Bio is required' }).max(500, { message: 'Bio is too long' })
})

type AboutusFormValues = z.infer<typeof aboutusSchema>
type LeaderFormValues = z.infer<typeof leaderFormSchema>

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

export default function AdminAboutus({ data }: TProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Image states
  const [backgroundImage, setBackgroundImage] = useState<MediaFile | undefined>()
  const [historyImage, setHistoryImage] = useState<MediaFile | undefined>()
  const [missionImage, setMissionImage] = useState<MediaFile | undefined>()
  const [bottomImage, setBottomImage] = useState<MediaFile | undefined>()

  // Leader modal states
  const [leaderModalOpen, setLeaderModalOpen] = useState(false)
  const [editingLeaderIndex, setEditingLeaderIndex] = useState<number | null>(null)
  const [isLeaderSubmitting, setIsLeaderSubmitting] = useState(false)

  // Main form setup
  const form = useForm<AboutusFormValues>({
    resolver: zodResolver(aboutusSchema),
    defaultValues: {
      title: '',
      history: { title: '', description: '' },
      mission: { title: '', description: '' },
      leadership: { title: '', description: '', leaders: [] }
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

  // Field array for leaders
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
        history: {
          title: data.history?.title || '',
          description: data.history?.description || ''
        },
        mission: {
          title: data.mission?.title || '',
          description: data.mission?.description || ''
        },
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
      setHistoryImage(data.history?.image)
      setMissionImage(data.mission?.image)
      setBottomImage(data.bottomImage)
    }
  }, [data, form])

  // Handle main form submission
  const onSubmit = async (values: AboutusFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Clean MediaFile data for leaders (they don't have images in this schema)
      const cleanedLeaders =
        values.leadership.leaders?.map((leader) => ({
          name: leader.name,
          designation: leader.designation,
          bio: leader.bio
        })) || []

      const aboutusData: Partial<Aboutus> = {
        title: values.title,
        backgroundImage: backgroundImage
          ? {
              file: backgroundImage.file || '',
              fileId: backgroundImage.fileId || '',
              thumbnail: backgroundImage.thumbnail || ''
            }
          : undefined,
        history: {
          title: values.history.title,
          description: values.history.description,
          image: historyImage
            ? {
                file: historyImage.file || '',
                fileId: historyImage.fileId || '',
                thumbnail: historyImage.thumbnail || ''
              }
            : undefined
        },
        mission: {
          title: values.mission.title,
          description: values.mission.description,
          image: missionImage
            ? {
                file: missionImage.file || '',
                fileId: missionImage.fileId || '',
                thumbnail: missionImage.thumbnail || ''
              }
            : undefined
        },
        leadership: {
          title: values.leadership.title,
          description: values.leadership.description,
          leaders: cleanedLeaders
        },
        bottomImage: bottomImage
          ? {
              file: bottomImage.file || '',
              fileId: bottomImage.fileId || '',
              thumbnail: bottomImage.thumbnail || ''
            }
          : undefined
      }

      const result = await updateAboutus(aboutusData)

      if (result.success) {
        toast.success('About Us data updated successfully')
      } else {
        setError(result.error || 'Failed to update About Us data')
        toast.error(result.error || 'Failed to update About Us data')
      }
    } catch (err) {
      console.error('Error updating About Us:', err)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding new leader
  const handleAddLeader = () => {
    setEditingLeaderIndex(null)
    leaderForm.reset({ name: '', designation: '', bio: '' })
    setLeaderModalOpen(true)
  }

  // Handle editing existing leader
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

  // Handle leader form submission
  const onLeaderSubmit = async (values: LeaderFormValues) => {
    setIsLeaderSubmitting(true)

    try {
      if (editingLeaderIndex !== null) {
        // Update existing leader
        updateLeaderField(editingLeaderIndex, {
          ...values,
          _id: leaderFields[editingLeaderIndex]._id
        })
        toast.success('Leader updated successfully')
      } else {
        // Add new leader
        appendLeader({
          ...values,
          _id: generateId()
        })
        toast.success('Leader added successfully')
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

  // Handle leader deletion
  const handleDeleteLeader = (index: number) => {
    removeLeader(index)
    toast.success('Leader removed successfully')
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
                        src={backgroundImage.file}
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

          {/* History Section */}
          <Card>
            <CardHeader>
              <CardTitle>History Section</CardTitle>
              <CardDescription>Information about your company's history</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='history.title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>History Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Our History' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='history.description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>History Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell the story of your company's founding and growth..."
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-2'>
                <FormLabel>History Image</FormLabel>
                {historyImage?.file && (
                  <div className='mb-4 relative max-w-xs'>
                    <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                      <Image
                        src={historyImage.file}
                        alt='History image preview'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>History section image</p>
                  </div>
                )}
                <ImageUploader
                  fileId={historyImage?.fileId}
                  setFile={(file) => setHistoryImage(file)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card>
            <CardHeader>
              <CardTitle>Mission Section</CardTitle>
              <CardDescription>Information about your company's mission</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='mission.title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Our Mission' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='mission.description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your company's mission and values..."
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-2'>
                <FormLabel>Mission Image</FormLabel>
                {missionImage?.file && (
                  <div className='mb-4 relative max-w-xs'>
                    <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                      <Image
                        src={missionImage.file}
                        alt='Mission image preview'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>Mission section image</p>
                  </div>
                )}
                <ImageUploader
                  fileId={missionImage?.fileId}
                  setFile={(file) => setMissionImage(file)}
                />
              </div>
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
                        src={bottomImage.file}
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
          <div className='flex justify-end'>
            <Button type='submit' disabled={isSubmitting} size='lg'>
              {isSubmitting ? 'Saving...' : 'Save About Us Data'}
            </Button>
          </div>
        </form>
      </Form>

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
