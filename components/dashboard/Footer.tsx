'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { SOCIAL_PLATFORMS } from '../others/social-platform'

type TProps = {
  data?: FooterSection
}

// Define the Zod schema for social links
const socialLinkSchema = z.object({
  icon: z.string().min(1, { message: 'Icon is required' }),
  link: z.string().min(1, { message: 'Please enter a valid URL' }),
  _id: z.string().optional() // For unique identification
})

// Define the Zod schema for get in touch items
const getInTouchSchema = z.object({
  key: z.string().min(1, { message: 'Key is required' }).max(50, { message: 'Key is too long' }),
  value: z
    .string()
    .min(1, { message: 'Value is required' })
    .max(100, { message: 'Value is too long' }),
  _id: z.string().optional() // For unique identification
})

// Define the Zod schema for the footer section
const footerSchema = z.object({
  aboutText: z
    .string()
    .min(1, { message: 'About text is required' })
    .max(500, { message: 'About text is too long' }),
  socialMoto: z
    .string()
    .min(1, { message: 'Social motto is required' })
    .max(100, { message: 'Social motto is too long' }),
  getInTouch: z
    .array(getInTouchSchema)
    .min(1, { message: 'At least one contact detail is required' }),
  socialLinks: z.array(socialLinkSchema).min(1, { message: 'At least one social link is required' })
})

type FooterFormValues = z.infer<typeof footerSchema>

export default function Footer({ data }: TProps) {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form with default values from data prop
  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      aboutText: data?.aboutText || 'We are a company dedicated to providing exceptional services.',
      socialMoto: data?.socialMoto || 'Follow us on social media',
      getInTouch: data?.getInTouch?.map((item) => ({
        key: item.key || '',
        value: item.value || '',
        _id: Math.random().toString(36).substring(2, 9)
      })) || [
        {
          key: 'Email',
          value: 'info@example.com',
          _id: Math.random().toString(36).substring(2, 9)
        },
        {
          key: 'Phone',
          value: '+1 234 567 890',
          _id: Math.random().toString(36).substring(2, 9)
        },
        {
          key: 'Address',
          value: '123 Street, City, Country',
          _id: Math.random().toString(36).substring(2, 9)
        }
      ],
      socialLinks: data?.socialLinks?.map((link) => ({
        icon: link.icon || '',
        link: link.link || '',
        _id: Math.random().toString(36).substring(2, 9)
      })) || [
        {
          icon: 'facebook',
          link: 'https://facebook.com',
          _id: Math.random().toString(36).substring(2, 9)
        },
        {
          icon: 'twitter',
          link: 'https://twitter.com',
          _id: Math.random().toString(36).substring(2, 9)
        }
      ]
    },
    mode: 'onBlur' // Better performance by validating only on blur
  })

  // Set up field array for managing social links
  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial
  } = useFieldArray({
    control: form.control,
    name: 'socialLinks'
  })

  // Set up field array for managing get in touch items
  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact
  } = useFieldArray({
    control: form.control,
    name: 'getInTouch'
  })

  // Add a new social link
  const addSocialLink = () => {
    appendSocial({
      icon: '',
      link: '',
      _id: Math.random().toString(36).substring(2, 9)
    })
  }

  // Add a new contact detail
  const addContactDetail = () => {
    appendContact({
      key: '',
      value: '',
      _id: Math.random().toString(36).substring(2, 9)
    })
  }

  // Submit handler
  const onSubmit = async (values: FooterFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Map form values to FooterSection format
      const footerData: FooterSection = {
        aboutText: values.aboutText,
        socialMoto: values.socialMoto,
        getInTouch: values.getInTouch.map((item) => ({
          key: item.key,
          value: item.value
          // Intentionally omit _id to prevent MongoDB validation errors
        })),
        socialLinks: values.socialLinks.map((link) => ({
          icon: link.icon,
          link: link.link
          // Intentionally omit _id to prevent MongoDB validation errors
        }))
      }

      // Call the server action to update the footer section
      const result = await updateHomepageSection('footer', footerData)

      if (result.success) {
        toast.success('Footer section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the footer section')
        setError(result.error || 'An error occurred while updating the footer section')
      }
    } catch (err) {
      console.error('Error updating footer section:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>Footer Section</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {/* Display error message */}
          {error && <FormError message={error} />}

          {/* About Section */}
          <div className='space-y-4'>
            <h2 className='text-lg font-medium'>About Text</h2>
            <FormField
              control={form.control}
              name='aboutText'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter a brief description of your company'
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Get In Touch Section */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-medium'>Contact Details</h2>
              <Button type='button' onClick={addContactDetail} variant='outline' size='sm'>
                <Plus className='h-4 w-4 mr-2' />
                Add Contact Detail
              </Button>
            </div>

            <div className='space-y-3'>
              {contactFields.map((field, index) => (
                <div key={field._id} className='flex gap-3 items-end'>
                  {/* Contact Type */}
                  <FormField
                    control={form.control}
                    name={`getInTouch.${index}.key`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input placeholder='Email, Phone, Address...' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Value */}
                  <FormField
                    control={form.control}
                    name={`getInTouch.${index}.value`}
                    render={({ field }) => (
                      <FormItem className='flex-[2]'>
                        <FormLabel>Details</FormLabel>
                        <FormControl>
                          <Input placeholder='info@example.com, +1 234 567 890...' {...field} />
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
                    onClick={() => removeContact(index)}
                    disabled={contactFields.length <= 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='socialMoto'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder='Follow us on social media' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-between items-center mt-4'>
              <h2 className='text-lg font-medium'>Social Media Links</h2>
              <Button type='button' onClick={addSocialLink} variant='outline' size='sm'>
                <Plus className='h-4 w-4 mr-2' />
                Add Social Link
              </Button>
            </div>

            <div className='space-y-3'>
              {socialFields.map((field, index) => (
                <div key={field._id} className='flex gap-3 items-end'>
                  {/* Platform Icon - Now using Select component */}
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.icon`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Platform</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select platform' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SOCIAL_PLATFORMS.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Platform URL */}
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.link`}
                    render={({ field }) => (
                      <FormItem className='flex-[2]'>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder='https://facebook.com/yourpage' {...field} />
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
                    onClick={() => removeSocial(index)}
                    disabled={socialFields.length <= 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type='submit' disabled={isSubmitting} className='mt-6'>
            {isSubmitting ? 'Saving...' : 'Save Footer Section'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
