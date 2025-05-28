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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: AboutSection
}

// Define the Zod schema for about section validation
const aboutSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(2, 'Description is required')
})

// Define the form type
type AboutFormValues = z.infer<typeof aboutSchema>

export default function About({ data }: TProps) {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form with default values from data prop
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: data?.title || '',
      description: data?.description || ''
    },
    mode: 'onSubmit'
  })

  // Submit handler
  const onSubmit = async (values: AboutFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await updateHomepageSection('about', values)

      if (result.success) {
        toast.success('About section updated successfully')
      } else {
        setError('Failed to update about section')
        toast.error('Failed to update about section')
      }
    } catch (error) {
      console.error('Error updating about section:', error)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold lg:text-2xl'>About Section</h1>
      </div>

      <Card className='border border-gray-200 hover:border-black'>
        <CardHeader className='p-4 pb-3'>
          <CardTitle className='text-base'>About Content</CardTitle>
        </CardHeader>

        <CardContent className='p-4 pt-0'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {error && <FormError message={error} />}

              {/* Title field */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter about section title' {...field} className='h-9' />
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
                    <FormLabel className='text-sm font-medium'>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter about section description'
                        {...field}
                        className='min-h-[100px] resize-none'
                      />
                    </FormControl>
                    <FormMessage />
                    <p className='text-xs text-muted-foreground'>
                      Provide a detailed description about your company or organization.
                    </p>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className='flex justify-end pt-2'>
                <Button type='submit' disabled={isSubmitting} className='cursor-pointer'>
                  {isSubmitting ? 'Saving...' : 'Save About Section'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
