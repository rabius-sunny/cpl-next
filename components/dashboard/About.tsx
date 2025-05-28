'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: AboutSection
}

// Define team member schema
const teamMemberSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  designation: z.string().min(1, { message: 'Designation is required' }),
  _id: z.string().optional() // For React key management
})

// Define stat item schema
const statSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Stat title is required' })
    .max(50, { message: 'Stat title is too long' }),
  count: z.coerce
    .number()
    .min(0, { message: 'Count must be a positive number' })
    .max(999999, { message: 'Count is too large' }),
  _id: z.string().optional() // For React key management
})

// Define the Zod schema for validation
const aboutSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  subtitle: z
    .string()
    .min(1, { message: 'Subtitle is required' })
    .max(300, { message: 'Subtitle is too long' }),
  heading: z.string().optional(),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description is too long' }),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  stats: z.array(statSchema).optional(),
  teamfirst: z.array(teamMemberSchema).optional(),
  teamsecond: z.array(teamMemberSchema).optional()
})

// Define the form type
type AboutFormValues = z.infer<typeof aboutSchema>

export default function About({ data }: TProps) {
  // Helper to generate stable IDs for team members
  const createStableId = (type: 'teamfirst' | 'teamsecond', index: number) => {
    return `${type}-${index}`
  }

  // State for images and uploading states
  const [images, setImages] = useState<MediaFile[]>(data?.images || [])
  const [teamFirstImages, setTeamFirstImages] = useState<Record<string, MediaFile | undefined>>({})
  const [teamSecondImages, setTeamSecondImages] = useState<Record<string, MediaFile | undefined>>(
    {}
  )
  const [isUploading, setIsUploading] = useState(false)

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper to generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9)

  // Initialize team images from data
  useEffect(() => {
    if (data?.teamfirst && data.teamfirst.length > 0) {
      const imgMap: Record<string, MediaFile | undefined> = {}
      data.teamfirst.forEach((member, index) => {
        // Use the stable ID based on index
        const stableId = createStableId('teamfirst', index)
        imgMap[stableId] = member.image
      })
      setTeamFirstImages(imgMap)
    }

    if (data?.teamsecond && data.teamsecond.length > 0) {
      const imgMap: Record<string, MediaFile | undefined> = {}
      data.teamsecond.forEach((member, index) => {
        // Use the stable ID based on index
        const stableId = createStableId('teamsecond', index)
        imgMap[stableId] = member.image
        imgMap[stableId] = member.image
      })
      setTeamSecondImages(imgMap)
    }
  }, [data])

  // Create form with default values from data prop
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      description: data?.description || '',
      stats: data?.stats?.map((stat) => ({
        title: stat.title || '',
        count: stat.count || 0,
        _id: generateId()
      })) || [
        {
          title: 'Projects Completed',
          count: 100,
          _id: generateId()
        }
      ],
      teamfirst:
        data?.teamfirst?.map((member, index) => ({
          name: member.name || '',
          designation: member.designation || '',
          // Use a stable ID based on the index for consistency
          _id: createStableId('teamfirst', index)
        })) || [],
      teamsecond:
        data?.teamsecond?.map((member, index) => ({
          name: member.name || '',
          designation: member.designation || '',
          // Use a stable ID based on the index for consistency
          _id: createStableId('teamsecond', index)
        })) || []
    },
    mode: 'onBlur'
  })

  // Set up field array for managing stats
  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat
  } = useFieldArray({
    control: form.control,
    name: 'stats'
  })

  // Set up field array for team first
  const {
    fields: teamFirstFields,
    append: appendTeamFirst,
    remove: removeTeamFirst
  } = useFieldArray({
    control: form.control,
    name: 'teamfirst'
  })

  // Set up field array for team second
  const {
    fields: teamSecondFields,
    append: appendTeamSecond,
    remove: removeTeamSecond
  } = useFieldArray({
    control: form.control,
    name: 'teamsecond'
  })

  // Add a new stat
  const addStat = () => {
    appendStat({
      title: '',
      count: 0,
      _id: Math.random().toString(36).substring(2, 9)
    })
  }

  // Add a new team member to first team
  const addTeamFirst = () => {
    // Get the current length of the array to generate the next stable ID
    const currentLength = teamFirstFields.length
    appendTeamFirst({
      name: '',
      designation: '',
      _id: createStableId('teamfirst', currentLength)
    })
  }

  // Add a new team member to second team
  const addTeamSecond = () => {
    // Get the current length of the array to generate the next stable ID
    const currentLength = teamSecondFields.length
    appendTeamSecond({
      name: '',
      designation: '',
      _id: createStableId('teamsecond', currentLength)
    })
  }

  // Handle team member image upload
  const handleTeamFirstImageUpload = (memberId: string | undefined, file: MediaFile) => {
    if (!memberId) return
    setTeamFirstImages((prev) => ({
      ...prev,
      [memberId]: file
    }))
    // Reset loading state for this member
  }

  // Handle team second image upload
  const handleTeamSecondImageUpload = (memberId: string | undefined, file: MediaFile) => {
    if (!memberId) return
    setTeamSecondImages((prev) => ({
      ...prev,
      [memberId]: file
    }))
    // Reset loading state for this member
  }

  // Submit handler
  const onSubmit = async (values: AboutFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Process team members with their images
      const teamFirstWithImages = values.teamfirst?.map((member) => {
        // Get image for this member by ID
        const image = member._id ? teamFirstImages[member._id] : undefined

        return {
          name: member.name,
          designation: member.designation,
          image: image
        }
      })

      const teamSecondWithImages = values.teamsecond?.map((member) => {
        // Get image for this member by ID
        const image = member._id ? teamSecondImages[member._id] : undefined

        return {
          name: member.name,
          designation: member.designation,
          image: image
        }
      })

      // Prepare about data with form values and images
      const aboutData = {
        ...values,
        images: images, // Use the images array instead of media
        stats: values.stats?.map((stat) => ({
          title: stat.title,
          count: stat.count
          // Intentionally omit _id to prevent MongoDB validation errors
        })),
        teamfirst: teamFirstWithImages,
        teamsecond: teamSecondWithImages
      }

      // Call the server action to update the about section
      const result = await updateHomepageSection('about', aboutData)

      if (result.success) {
        toast.success('About section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the about section')
        setError(result.error || 'An error occurred while updating the about section')
      }
    } catch (err) {
      console.error('Error updating about section:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>About Section</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Display error message */}
          {error && <FormError message={error} />}

          {/* Title field */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input placeholder='About Us' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subtitle field */}
          <FormField
            control={form.control}
            name='subtitle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder='Learn more about our company and mission' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description field */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter a detailed description about your company...'
                    className='min-h-[150px]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stats Section */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-medium'>Stats</h2>
                <Button type='button' onClick={addStat} variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Stat
                </Button>
              </div>

              <div className='space-y-3'>
                {statFields.map((field, index) => (
                  <div key={field._id} className='flex gap-3 items-end'>
                    {/* Stat Title */}
                    <FormField
                      control={form.control}
                      name={`stats.${index}.title`}
                      render={({ field }) => (
                        <FormItem className='flex-[2]'>
                          <FormLabel>Stat Title</FormLabel>
                          <FormControl>
                            <Input placeholder='Projects Completed, Happy Clients...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Stat Count */}
                    <FormField
                      control={form.control}
                      name={`stats.${index}.count`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='100'
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === '' ? '0' : e.target.value
                                field.onChange(value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove Button */}
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 text-destructive'
                      onClick={() => removeStat(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team First Section */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-medium'>Team - First Half</h2>
                <Button type='button' onClick={addTeamFirst} variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Team Member
                </Button>
              </div>

              <div className='space-y-8'>
                {teamFirstFields.map((field, index) => (
                  <Card
                    key={field._id}
                    className='space-y-4 px-3 py-4 border-l-4 border-l-primary/30'
                  >
                    <div className='flex flex-wrap gap-3 items-end'>
                      {/* Member Name */}
                      <FormField
                        control={form.control}
                        name={`teamfirst.${index}.name`}
                        render={({ field }) => (
                          <FormItem className='flex-1 min-w-[200px]'>
                            <FormLabel>Member Name</FormLabel>
                            <FormControl>
                              <Input placeholder='John Doe' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Member Designation */}
                      <FormField
                        control={form.control}
                        name={`teamfirst.${index}.designation`}
                        render={({ field }) => (
                          <FormItem className='flex-1 min-w-[200px]'>
                            <FormLabel>Designation</FormLabel>
                            <FormControl>
                              <Input placeholder='CEO, Founder...' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Remove Button */}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-10 w-10 text-destructive'
                        onClick={() => {
                          // Get the member's ID before removing
                          const memberId = field._id

                          // Remove from the form
                          removeTeamFirst(index)

                          // Also clean up the images state if we have an ID
                          if (memberId) {
                            setTeamFirstImages((prev) => {
                              const newState = { ...prev }
                              delete newState[memberId]
                              return newState
                            })
                          }
                        }}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>

                    {/* Member Image Upload - Placed below name and designation */}
                    <div className='w-full'>
                      <FormLabel>Member Image</FormLabel>

                      {/* Image preview */}
                      {field._id && teamFirstImages[field._id] && (
                        <div className='mb-4 relative flex items-center gap-3'>
                          <div className='border rounded-md overflow-hidden relative aspect-square w-16 h-16'>
                            <Image
                              src={teamFirstImages[field._id]?.file || '/placeholder.webp'}
                              alt='Team member image'
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='text-xs text-muted-foreground'>Current member image</p>
                        </div>
                      )}

                      {/* Image uploader component */}
                      <ImageUploader
                        fileId={field._id ? teamFirstImages[field._id]?.fileId : undefined}
                        setFile={(file) => handleTeamFirstImageUpload(field._id, file)}
                      />

                      <p className='text-xs text-muted-foreground mt-2'>
                        Upload an image for the team member. Recommended size: 800x800px.
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Second Section */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-medium'>Team - Second Half</h2>
                <Button type='button' onClick={addTeamSecond} variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Team Member
                </Button>
              </div>

              <div className='space-y-8'>
                {teamSecondFields.map((field, index) => (
                  <Card
                    key={field._id}
                    className='space-y-4 px-3 py-4 border-l-4 border-l-blue-400/30'
                  >
                    <div className='flex flex-wrap gap-3 items-end'>
                      {/* Member Name */}
                      <FormField
                        control={form.control}
                        name={`teamsecond.${index}.name`}
                        render={({ field }) => (
                          <FormItem className='flex-1 min-w-[200px]'>
                            <FormLabel>Member Name</FormLabel>
                            <FormControl>
                              <Input placeholder='Jane Doe' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Member Designation */}
                      <FormField
                        control={form.control}
                        name={`teamsecond.${index}.designation`}
                        render={({ field }) => (
                          <FormItem className='flex-1 min-w-[200px]'>
                            <FormLabel>Designation</FormLabel>
                            <FormControl>
                              <Input placeholder='CTO, Co-founder...' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Remove Button */}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-10 w-10 text-destructive'
                        onClick={() => {
                          // Get the member's ID before removing
                          const memberId = field._id

                          // Remove from the form
                          removeTeamSecond(index)

                          // Also clean up the images state if we have an ID
                          if (memberId) {
                            setTeamSecondImages((prev) => {
                              const newState = { ...prev }
                              delete newState[memberId]
                              return newState
                            })
                          }
                        }}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>

                    {/* Member Image Upload - Placed below name and designation */}
                    <div className='w-full'>
                      <FormLabel>Member Image</FormLabel>

                      {/* Image preview */}
                      {field._id && teamSecondImages[field._id] && (
                        <div className='mb-4 relative flex items-center gap-3'>
                          <div className='border rounded-md overflow-hidden relative aspect-square w-16 h-16'>
                            <Image
                              src={teamSecondImages[field._id]?.file || '/placeholder.webp'}
                              alt='Team member image'
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='text-xs text-muted-foreground'>Current member image</p>
                        </div>
                      )}

                      {/* Image uploader component */}
                      <ImageUploader
                        fileId={field._id ? teamSecondImages[field._id]?.fileId : undefined}
                        setFile={(file) => handleTeamSecondImageUpload(field._id, file)}
                      />
                      <p className='text-xs text-muted-foreground mt-2'>
                        Upload an image for the team member. Recommended size: 800x800px.
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Images Upload */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-medium'>Media Images</h2>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  disabled={isUploading}
                  onClick={() => {
                    // Trigger the file input click programmatically
                    document.getElementById('media-image-upload')?.click()
                  }}
                >
                  {isUploading ? (
                    <>
                      <div className='animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full'></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Image
                    </>
                  )}
                </Button>
              </div>

              {/* Hidden image uploader component that will be triggered by the Add Image button */}
              <div className='hidden'>
                <ImageUploader
                  fileId={undefined}
                  setFile={(file) => {
                    setImages([...images, file])
                    setIsUploading(false)
                  }}
                  id='media-image-upload'
                  onStartUpload={() => setIsUploading(true)}
                />
              </div>

              {/* Loading indicator */}
              {isUploading && (
                <div className='mb-4 p-3 bg-muted/50 rounded-md flex items-center gap-2'>
                  <div className='animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full'></div>
                  <p className='text-sm text-muted-foreground'>Uploading image...</p>
                </div>
              )}

              {/* Image gallery */}
              {images.length > 0 ? (
                <div>
                  <p className='text-xs text-muted-foreground mb-2'>
                    {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
                  </p>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {images.map(
                      (image, index) =>
                        image?.file && (
                          <div key={index} className='relative group'>
                            <div className='border rounded-md overflow-hidden relative aspect-video'>
                              <Image
                                src={image.file || '/placeholder.webp'}
                                alt={`About section image ${index + 1}`}
                                fill
                                className='object-cover'
                              />
                              <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                <Button
                                  type='button'
                                  variant='destructive'
                                  size='sm'
                                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                                  className='scale-90 hover:scale-100 transition-transform'
                                >
                                  <Trash2 className='h-4 w-4 mr-2' /> Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              ) : (
                <div className='text-center py-8 border border-dashed rounded-md'>
                  <p className='text-muted-foreground'>No media images added yet</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Click "Add Image" to upload images for the about section
                  </p>
                </div>
              )}

              <p className='text-xs text-muted-foreground mt-4'>
                Upload images for the about section. Recommended size: 1200x800px.
              </p>
            </CardContent>
          </Card>

          <Button type='submit' disabled={isSubmitting} className='mt-4'>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
