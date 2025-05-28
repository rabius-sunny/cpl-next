'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import { SocialLinksSection } from '@/components/dashboard/SocialLinkComp'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: FooterSection
}

// Define the Zod schema for footer validation
const footerSchema = z.object({
  copyright: z.string().optional()
})

// Define the form type
type FooterFormValues = z.infer<typeof footerSchema>

// Social link type for the component
type SocialLink = {
  icon: string
  link: string
  _id: string
}

export default function AdminFooter({ data }: TProps) {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for office and factory items
  const [officeItems, setOfficeItems] = useState<string[]>(data?.office?.items || [])
  const [factoryItems, setFactoryItems] = useState<string[]>(data?.factory?.items || [])

  // Convert SocialItem[] to SocialLink[] for the component
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    data?.social?.map((item, index) => ({
      icon: item.icon || 'facebook',
      link: item.link || '',
      _id: `social-${index}`
    })) || []
  )

  // Create form with default values from data prop
  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      copyright: data?.copyright || ''
    },
    mode: 'onBlur'
  })

  // Office items handlers
  const addOfficeItem = () => {
    setOfficeItems([...officeItems, ''])
  }

  const updateOfficeItem = (index: number, value: string) => {
    const updated = [...officeItems]
    updated[index] = value
    setOfficeItems(updated)
  }

  const removeOfficeItem = (index: number) => {
    const updated = [...officeItems]
    updated.splice(index, 1)
    setOfficeItems(updated)
  }

  // Factory items handlers
  const addFactoryItem = () => {
    setFactoryItems([...factoryItems, ''])
  }

  const updateFactoryItem = (index: number, value: string) => {
    const updated = [...factoryItems]
    updated[index] = value
    setFactoryItems(updated)
  }

  const removeFactoryItem = (index: number) => {
    const updated = [...factoryItems]
    updated.splice(index, 1)
    setFactoryItems(updated)
  }

  // Submit handler
  const onSubmit = async (values: FooterFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Convert SocialLink[] back to SocialItem[]
      const socialItems: SocialItem[] = socialLinks.map((link) => ({
        icon: link.icon,
        link: link.link
      }))

      const footerData: FooterSection = {
        office:
          officeItems.length > 0
            ? { items: officeItems.filter((item: string) => item.trim() !== '') }
            : undefined,
        factory:
          factoryItems.length > 0
            ? { items: factoryItems.filter((item: string) => item.trim() !== '') }
            : undefined,
        social: socialItems.length > 0 ? socialItems : undefined,
        copyright: values.copyright
      }

      const result = await updateHomepageSection('footer', footerData)

      if (result.success) {
        toast.success('Footer section updated successfully')
      } else {
        setError('Failed to update footer section')
        toast.error('Failed to update footer section')
      }
    } catch (error) {
      console.error('Error updating footer section:', error)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold lg:text-2xl'>Footer Section</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {error && <FormError message={error} />}

          {/* Office Items */}
          <Card className='border border-gray-200 hover:border-black'>
            <CardHeader className='p-4 pb-3'>
              <div className='flex justify-between items-center'>
                <CardTitle className='text-base'>Office Information</CardTitle>
                <Button
                  type='button'
                  onClick={addOfficeItem}
                  variant='outline'
                  size='sm'
                  className='h-6 text-xs'
                >
                  <Plus className='h-3 w-3 mr-1' />
                  Add Item
                </Button>
              </div>
            </CardHeader>

            <CardContent className='p-4 pt-0 space-y-3'>
              {officeItems.map((item, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    placeholder='Enter office information'
                    value={item}
                    onChange={(e) => updateOfficeItem(index, e.target.value)}
                    className='h-7 text-sm flex-1'
                  />
                  <Button
                    type='button'
                    onClick={() => removeOfficeItem(index)}
                    variant='ghost'
                    size='icon'
                    className='size-7 bg-red-100 text-destructive hover:text-white cursor-pointer hover:bg-destructive'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              ))}

              {officeItems.length === 0 && (
                <div className='text-center py-4 text-muted-foreground text-sm'>
                  No office information added yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Factory Items */}
          <Card className='border border-gray-200 hover:border-black'>
            <CardHeader className='p-4 pb-3'>
              <div className='flex justify-between items-center'>
                <CardTitle className='text-base'>Factory Information</CardTitle>
                <Button
                  type='button'
                  onClick={addFactoryItem}
                  variant='outline'
                  size='sm'
                  className='h-6 text-xs'
                >
                  <Plus className='h-3 w-3 mr-1' />
                  Add Item
                </Button>
              </div>
            </CardHeader>

            <CardContent className='p-4 pt-0 space-y-3'>
              {factoryItems.map((item, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    placeholder='Enter factory information'
                    value={item}
                    onChange={(e) => updateFactoryItem(index, e.target.value)}
                    className='h-7 text-sm flex-1'
                  />
                  <Button
                    type='button'
                    onClick={() => removeFactoryItem(index)}
                    variant='ghost'
                    size='icon'
                    className='size-7 bg-red-100 text-destructive hover:text-white cursor-pointer hover:bg-destructive'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              ))}

              {factoryItems.length === 0 && (
                <div className='text-center py-4 text-muted-foreground text-sm'>
                  No factory information added yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className='border border-gray-200 hover:border-black'>
            <CardHeader className='p-4 pb-3'>
              <CardTitle className='text-base'>Social Media</CardTitle>
            </CardHeader>

            <CardContent className='p-4 pt-0'>
              <SocialLinksSection socialLinks={socialLinks} onSocialLinksChange={setSocialLinks} />
            </CardContent>
          </Card>

          {/* Copyright */}
          <Card className='border border-gray-200 hover:border-black'>
            <CardHeader className='p-4 pb-3'>
              <CardTitle className='text-base'>Copyright</CardTitle>
            </CardHeader>

            <CardContent className='p-4 pt-0'>
              <FormField
                control={form.control}
                name='copyright'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Copyright Text</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter copyright text' {...field} className='text-sm' />
                    </FormControl>
                    <FormMessage />
                    <p className='text-xs text-muted-foreground'>
                      Enter the copyright notice for your website footer.
                    </p>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
            <Button type='submit' disabled={isSubmitting} className='cursor-pointer'>
              {isSubmitting ? 'Saving...' : 'Save Footer Section'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
