'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: TestimonialsSection
}

// Define testimonial item schema
const testimonialItemSchema = z.object({
  message: z.string().optional(),
  name: z.string().optional(),
  designation: z.string().optional(),
  _id: z.string().optional() // For React key management
})

// Define the Zod schema for testimonials validation
const testimonialsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(testimonialItemSchema).optional()
})

// Define the form type
type TestimonialsFormValues = z.infer<typeof testimonialsSchema>

export default function Testimonials({ data }: TProps) {
  // Helper to generate stable IDs
  const createStableId = (index: number) => `testimonial-${index}`

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form with default values from data prop
  const form = useForm<TestimonialsFormValues>({
    resolver: zodResolver(testimonialsSchema),
    defaultValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      items:
        data?.items?.map((item, index) => ({
          message: item.message || '',
          name: item.name || '',
          designation: item.designation || '',
          _id: createStableId(index)
        })) || []
    },
    mode: 'onSubmit'
  })

  // Set up field array for managing testimonial items
  const {
    fields: testimonialFields,
    append: appendTestimonial,
    remove: removeTestimonial
  } = useFieldArray({
    control: form.control,
    name: 'items'
  })

  // Add a new testimonial item
  const addTestimonial = () => {
    const currentLength = testimonialFields.length
    const newId = createStableId(currentLength)

    appendTestimonial({
      message: '',
      name: '',
      designation: '',
      _id: newId
    })
  }

  // Submit handler
  const onSubmit = async (values: TestimonialsFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Process testimonials data
      const processedTestimonials: TestimonialItem[] = (values.items || []).map((item) => ({
        message: item.message,
        name: item.name,
        designation: item.designation
      }))

      const testimonialsData: TestimonialsSection = {
        title: values.title,
        subtitle: values.subtitle,
        items: processedTestimonials.length > 0 ? processedTestimonials : undefined
      }

      const result = await updateHomepageSection('testimonials', testimonialsData)

      if (result.success) {
        toast.success('Testimonials section updated successfully')
      } else {
        setError('Failed to update testimonials section')
        toast.error('Failed to update testimonials section')
      }
    } catch (error) {
      console.error('Error updating testimonials section:', error)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold lg:text-2xl'>Testimonials Section</h1>
        <Button
          type='button'
          onClick={addTestimonial}
          variant='default'
          size='sm'
          className='cursor-pointer'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Testimonial
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {error && <FormError message={error} />}

          {/* Section Settings */}
          <Card className='border border-gray-200 hover:border-black'>
            <CardHeader className='p-4 pb-3'>
              <CardTitle className='text-base'>Section Settings</CardTitle>
            </CardHeader>

            <CardContent className='p-4 pt-0 space-y-4'>
              <div className='grid md:grid-cols-2 gap-4'>
                {/* Section Title */}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>Section Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter testimonials section title'
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Section Subtitle */}
                <FormField
                  control={form.control}
                  name='subtitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>Section Subtitle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter testimonials section subtitle'
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Testimonials Items */}
          {testimonialFields.length > 0 && (
            <Card className='border border-gray-200 hover:border-black'>
              <CardHeader className='p-4 pb-3'>
                <CardTitle className='text-base'>Testimonials</CardTitle>
              </CardHeader>

              <CardContent className='p-4 pt-0 space-y-4'>
                {testimonialFields.map((field, index) => (
                  <div key={field.id}>
                    {index > 0 && <Separator className='my-4' />}

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-primary'>
                          Testimonial {index + 1}
                        </span>
                        <Button
                          type='button'
                          onClick={() => removeTestimonial(index)}
                          variant='ghost'
                          size='icon'
                          className='size-7 bg-red-100 text-destructive hover:text-white cursor-pointer hover:bg-destructive'
                          disabled={testimonialFields.length <= 1}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>

                      {/* Message field */}
                      <FormField
                        control={form.control}
                        name={`items.${index}.message`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs text-muted-foreground'>
                              Testimonial Message
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Enter testimonial message'
                                {...field}
                                className='min-h-[80px] resize-none text-sm'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='grid md:grid-cols-2 gap-3'>
                        {/* Name field */}
                        <FormField
                          control={form.control}
                          name={`items.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs text-muted-foreground'>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter person name'
                                  {...field}
                                  className='h-7 text-sm'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Designation field */}
                        <FormField
                          control={form.control}
                          name={`items.${index}.designation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs text-muted-foreground'>
                                Designation
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter designation'
                                  {...field}
                                  className='h-7 text-sm'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {testimonialFields.length === 0 && (
            <div className='text-center py-8 text-muted-foreground border border-dashed rounded-md'>
              <p>No testimonials added yet. Click the "Add Testimonial" button to add one.</p>
            </div>
          )}

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
            <Button type='submit' disabled={isSubmitting} className='cursor-pointer'>
              {isSubmitting ? 'Saving...' : 'Save Testimonials Section'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
