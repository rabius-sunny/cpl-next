'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: ContactSection
}

// Define the Zod schema for validation
const contactSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' })
})

// Define the form type
type ContactFormValues = z.infer<typeof contactSchema>

export default function Contact({ data }: TProps) {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bannerImage, setBannerImage] = useState<MediaFile | undefined>(data?.banner)

  // Create form with default values from data prop
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      title: data?.title || ''
    },
    mode: 'onBlur' // Better performance by validating only on blur
  })

  // Submit handler
  const onSubmit = async (values: ContactFormValues) => {
    if (!bannerImage?.file) {
      setError('Banner image is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Combine form values with banner image
      const contactData = {
        ...values,
        banner: bannerImage
      }

      // Call the server action to update the contact section
      const result = await updateHomepageSection('contact', contactData)

      if (result.success) {
        toast.success('Contact section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the contact section')
        setError(result.error || 'An error occurred while updating the contact section')
      }
    } catch (err) {
      console.error('Error updating contact section:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>Contact Section</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {/* Display error message */}
          {error && <FormError message={error} />}
          {/* Section Heading */}
          <div className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Contact Us' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Banner Image Upload */}
          <div className='space-y-2'>
            <FormLabel>Banner Image</FormLabel>

            {/* Image preview */}
            {bannerImage?.file && (
              <div className='mb-4 relative'>
                <div className='border rounded-md overflow-hidden relative w-64 h-32'>
                  <Image
                    src={bannerImage.file}
                    alt='Contact banner image'
                    fill
                    className='object-contain'
                  />
                </div>
                <p className='text-xs text-muted-foreground mt-1'>Contact banner image</p>
              </div>
            )}

            {/* Image uploader component */}
            <ImageUploader fileId={bannerImage?.fileId} setFile={(file) => setBannerImage(file)} />
            <p className='text-xs text-muted-foreground'>
              Upload a banner image for the contact section. Recommended size: 1920x600px.
            </p>
          </div>

          <Button type='submit' disabled={isSubmitting} className='mt-6'>
            {isSubmitting ? 'Saving...' : 'Save Contact Section'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
