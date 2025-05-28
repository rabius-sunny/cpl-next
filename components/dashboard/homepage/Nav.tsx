'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
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
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: NavSection
}

// Define nav child item schema
const navChildSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  link: z.string().min(1, { message: 'Link is required' }),
  _id: z.string().optional() // For React key management
})

// Define nav item schema
const navItemSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  link: z.string().min(1, { message: 'Link is required' }),
  childrens: z.array(navChildSchema).optional(),
  _id: z.string().optional() // For React key management
})

// Define CTA schema
const ctaSchema = z.object({
  text: z.string().min(1, { message: 'CTA text is required' }),
  link: z.string().min(1, { message: 'CTA link is required' })
})

// Define the Zod schema for nav validation
const navSchema = z.object({
  cta: ctaSchema,
  items: z.array(navItemSchema).optional()
})

// Define the form type
type NavFormValues = z.infer<typeof navSchema>

export default function Nav({ data }: TProps) {
  // Helper to generate stable IDs
  const createStableId = (type: 'item' | 'child', parentIndex?: number, childIndex?: number) => {
    if (type === 'item') {
      return `item-${parentIndex}`
    }
    return `child-${parentIndex}-${childIndex}`
  }

  // State for logo image and uploading state
  const [logoImage, setLogoImage] = useState<MediaFile | undefined>(data?.logo)
  const [isUploading, setIsUploading] = useState(false)

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form with default values from data prop
  const form = useForm<NavFormValues>({
    resolver: zodResolver(navSchema),
    defaultValues: {
      cta: {
        text: data?.cta?.text || '',
        link: data?.cta?.link || ''
      },
      items:
        data?.items?.map((item, index) => ({
          title: item.title || '',
          link: item.link || '',
          childrens:
            item.childrens?.map((child, childIndex) => ({
              title: child.title || '',
              link: child.link || '',
              _id: createStableId('child', index, childIndex)
            })) || [],
          _id: createStableId('item', index)
        })) || []
    },
    mode: 'onSubmit'
  })

  // Set up field array for managing nav items
  const {
    fields: navItemFields,
    append: appendNavItem,
    remove: removeNavItem
  } = useFieldArray({
    control: form.control,
    name: 'items'
  })

  // Add a new nav item
  const addNavItem = () => {
    const currentLength = navItemFields.length
    appendNavItem({
      title: '',
      link: '',
      childrens: [],
      _id: createStableId('item', currentLength)
    })
  }

  // Add a new child item to a nav item
  const addChildItem = (itemIndex: number) => {
    const currentItems = form.getValues('items') || []
    const currentChildrens = currentItems[itemIndex]?.childrens || []
    const childLength = currentChildrens.length

    const updatedItems = [...currentItems]
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      childrens: [
        ...currentChildrens,
        {
          title: '',
          link: '',
          _id: createStableId('child', itemIndex, childLength)
        }
      ]
    }

    form.setValue('items', updatedItems)
  }

  // Remove a child item from a nav item
  const removeChildItem = (itemIndex: number, childIndex: number) => {
    const currentItems = form.getValues('items') || []
    const updatedItems = [...currentItems]
    const currentChildrens = updatedItems[itemIndex]?.childrens || []

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      childrens: currentChildrens.filter((_, index) => index !== childIndex)
    }

    form.setValue('items', updatedItems)
  }

  // Handle logo image upload
  const handleLogoUpload = (file: MediaFile) => {
    setLogoImage(file)
    setIsUploading(false) // Reset uploading state when upload completes
  }

  // Handle upload start
  const handleUploadStart = () => {
    setIsUploading(true)
  }

  // Submit handler
  const onSubmit = async (values: NavFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Process nav items with clean structure
      const processedItems = values.items?.map((item) => ({
        title: item.title,
        link: item.link,
        childrens:
          item.childrens?.map((child) => ({
            title: child.title,
            link: child.link
            // Intentionally omit _id to prevent MongoDB validation errors
          })) || []
        // Intentionally omit _id to prevent MongoDB validation errors
      }))

      // Prepare nav data with form values and logo
      const navData = {
        logo: logoImage,
        cta: {
          text: values.cta.text,
          link: values.cta.link
        },
        items: processedItems || []
      }

      // Call the server action to update the nav section
      const result = await updateHomepageSection('nav', navData)

      if (result.success) {
        toast.success('Navigation section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the navigation section')
        setError(result.error || 'An error occurred while updating the navigation section')
      }
    } catch (err) {
      console.error('Error updating nav section:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>Navigation Section</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {error && <FormError message={error} />}

          {/* Logo Section */}
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <Label>Logo Image</Label>

                {/* Logo preview */}
                {logoImage?.file && (
                  <div className='mb-4 relative max-w-xs'>
                    <div className='border rounded-md overflow-hidden relative aspect-video w-full max-w-48'>
                      <Image
                        src={logoImage.file}
                        alt='Logo preview'
                        fill
                        className='object-contain'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>Current logo</p>
                  </div>
                )}

                <ImageUploader
                  setFile={handleLogoUpload}
                  fileId={logoImage?.fileId}
                  onStartUpload={handleUploadStart}
                />
                <p className='text-xs text-muted-foreground'>
                  Upload a logo image for the navigation. Recommended size: 200x80px.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='cta.text'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Text</FormLabel>
                    <FormControl>
                      <Input placeholder='Get Quote' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='cta.link'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Link</FormLabel>
                    <FormControl>
                      <Input placeholder='/contact' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Navigation Items Section */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between py-3'>
              <CardTitle className='text-base'>Navigation Items</CardTitle>
              <Button type='button' onClick={addNavItem} size='sm'>
                <Plus className='h-4 w-4 mr-1' />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className='space-y-3 pt-0'>
              {navItemFields.map((field, itemIndex) => (
                <div key={field.id} className='border rounded-md p-3 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-muted-foreground'>
                      Item {itemIndex + 1}
                    </span>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeNavItem(itemIndex)}
                      className='h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <FormField
                      control={form.control}
                      name={`items.${itemIndex}.title`}
                      render={({ field }) => (
                        <FormItem className='space-y-1'>
                          <FormLabel className='text-xs'>Title</FormLabel>
                          <FormControl>
                            <Input placeholder='Home' {...field} className='h-8 text-sm' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${itemIndex}.link`}
                      render={({ field }) => (
                        <FormItem className='space-y-1'>
                          <FormLabel className='text-xs'>Link</FormLabel>
                          <FormControl>
                            <Input placeholder='/' {...field} className='h-8 text-sm' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Children Items */}
                  <div className='border-t pt-3 mt-3'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs font-medium text-muted-foreground'>
                        Sub-menu Items
                      </span>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => addChildItem(itemIndex)}
                        className='h-6 text-xs px-2'
                      >
                        <Plus className='h-3 w-3 mr-1' />
                        Add Sub-item
                      </Button>
                    </div>

                    {form.watch(`items.${itemIndex}.childrens`)?.map((child, childIndex) => (
                      <div
                        key={`${itemIndex}-${childIndex}`}
                        className='bg-muted/30 rounded p-2 mb-2 last:mb-0'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-xs text-muted-foreground'>
                            Sub-item {childIndex + 1}
                          </span>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => removeChildItem(itemIndex, childIndex)}
                            className='h-5 w-5 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                          >
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                          <FormField
                            control={form.control}
                            name={`items.${itemIndex}.childrens.${childIndex}.title`}
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel className='text-xs'>Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='About Us'
                                    {...field}
                                    className='h-7 text-xs'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`items.${itemIndex}.childrens.${childIndex}.link`}
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel className='text-xs'>Link</FormLabel>
                                <FormControl>
                                  <Input placeholder='/about' {...field} className='h-7 text-xs' />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {navItemFields.length === 0 && (
                <div className='text-center py-8 text-muted-foreground'>
                  No navigation items added yet. Click "Add Nav Item" to get started.
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          <div className='flex justify-end'>
            <Button type='submit' disabled={isSubmitting || isUploading}>
              {isSubmitting ? 'Updating...' : 'Update Navigation'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
