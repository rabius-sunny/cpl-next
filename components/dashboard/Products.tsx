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
  data?: Products
}

// Define the Zod schema for product item validation
const productItemSchema = z.object({
  name: z.string().optional(),
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

// Define the Zod schema for product section validation
const productSectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Section title is required' })
    .max(100, { message: 'Section title is too long' })
    .optional(),
  rightText: z
    .string()
    .min(1, { message: 'Right text is required' })
    .max(200, { message: 'Right text is too long' }),
  leftText: z
    .string()
    .min(1, { message: 'Left text is required' })
    .max(200, { message: 'Left text is too long' })
})

// Define the form types
type ProductItemFormValues = z.infer<typeof productItemSchema>
type ProductSectionFormValues = z.infer<typeof productSectionSchema>

export default function Products({ data }: TProps) {
  const [products, setProducts] = useState<Products>(
    data || { title: '', rightText: '', leftText: '', items: [] }
  )
  const [editSectionMode, setEditSectionMode] = useState(false)
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null)
  const [addItemMode, setAddItemMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)

  // Maximum number of additional images allowed per product
  const maxImagesLimit = 5

  // State for various product images
  const [itemIcon, setItemIcon] = useState<MediaFile | undefined>(undefined)
  const [itemThumbnail, setItemThumbnail] = useState<MediaFile | undefined>(undefined)
  const [itemImages, setItemImages] = useState<MediaFile[]>([])

  // Create form for product item
  const itemForm = useForm<ProductItemFormValues>({
    resolver: zodResolver(productItemSchema),
    defaultValues: {
      name: '',
      title: '',
      description: '',
      link: ''
    },
    mode: 'onBlur'
  })

  // Create form for product section
  const sectionForm = useForm<ProductSectionFormValues>({
    resolver: zodResolver(productSectionSchema),
    defaultValues: {
      title: products?.title || '',
      rightText: products?.rightText || '',
      leftText: products?.leftText || ''
    },
    mode: 'onBlur'
  })

  // Reset item form and state
  const resetItemForm = () => {
    itemForm.reset({
      name: '',
      title: '',
      description: '',
      link: ''
    })
    setItemIcon(undefined)
    setItemThumbnail(undefined)
    setItemImages([])
    setEditItemIndex(null)
    setAddItemMode(false)
    setError(null)
    setIsImageUploading(false)
    setImageUploadError(null)
  }

  // Toggle add item mode
  const handleAddItem = () => {
    resetItemForm()
    setAddItemMode(true)
  }

  // Begin editing an existing product item
  const handleEditItem = (item: ProductItem, index: number) => {
    setEditItemIndex(index)
    setItemIcon(item.icon)
    setItemThumbnail(item.thumbnail)
    setItemImages(item.images || [])
    setAddItemMode(false)

    itemForm.reset({
      name: item.name || '',
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
        title: products?.title || '',
        rightText: products?.rightText || '',
        leftText: products?.leftText || ''
      })
    }
    setEditSectionMode(!editSectionMode)
  }

  // Cancel editing section
  const handleCancelEditSection = () => {
    setEditSectionMode(false)
  }

  // Delete a product item
  const handleDeleteItem = async (index: number) => {
    if (!confirm('Are you sure you want to delete this product item?')) return

    const newItems = [...products.items]
    newItems.splice(index, 1)

    try {
      setIsSubmitting(true)
      const result = await updateOthersContent({
        products: {
          ...products,
          items: newItems
        }
      })

      if (result.success) {
        setProducts({
          ...products,
          items: newItems
        })
        toast.success('Product item deleted successfully')
      } else {
        toast.error('Failed to delete product item')
      }
    } catch (error) {
      console.error('Error deleting product item:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit handler for product item form
  const onItemSubmit = async (values: ProductItemFormValues) => {
    if (!itemThumbnail) {
      setError('Item thumbnail is required')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      // Prepare item data
      const itemData: ProductItem = {
        ...values,
        icon: itemIcon,
        thumbnail: itemThumbnail,
        images: itemImages
      }

      let newItems: ProductItem[]

      if (editItemIndex !== null) {
        // Update existing item
        newItems = [...products.items]
        newItems[editItemIndex] = itemData
      } else {
        // Add new item
        newItems = [...products.items, itemData]
      }

      // Call the server action to update products
      const result = await updateOthersContent({
        products: {
          ...products,
          items: newItems
        }
      })

      if (result.success) {
        // Update state
        setProducts({
          ...products,
          items: newItems
        })

        // Reset form
        resetItemForm()

        // Show success toast
        toast.success(
          editItemIndex !== null
            ? 'Product item updated successfully'
            : 'Product item added successfully'
        )
      } else {
        setError('An error occurred while saving the product item')
      }
    } catch (err) {
      console.error('Error saving product item:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit handler for product section form
  const onSectionSubmit = async (values: ProductSectionFormValues) => {
    setIsSubmitting(true)

    try {
      // Call the server action to update product section
      const result = await updateOthersContent({
        products: {
          ...products,
          title: values.title,
          rightText: values.rightText,
          leftText: values.leftText
        }
      })

      if (result.success) {
        // Update state
        setProducts({
          ...products,
          title: values.title,
          rightText: values.rightText,
          leftText: values.leftText
        })

        // Exit edit mode
        setEditSectionMode(false)

        // Show success toast
        toast.success('Product section updated successfully')
      } else {
        setError('An error occurred while saving the product section')
      }
    } catch (err) {
      console.error('Error saving product section:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function for image upload operations
  const handleImageUpload = (type: 'icon' | 'thumbnail' | 'additional') => {
    return {
      onStartUpload: () => {
        setIsImageUploading(true)
        setImageUploadError(null)
      },
      onComplete: (file: MediaFile) => {
        setIsImageUploading(false)

        switch (type) {
          case 'icon':
            setItemIcon(file)
            break
          case 'thumbnail':
            setItemThumbnail(file)
            break
          case 'additional':
            if (itemImages.length < maxImagesLimit) {
              setItemImages((prev) => [...prev, file])
              toast.success('Image added successfully')
            }
            break
        }
      },
      onError: (errorMsg: string) => {
        setIsImageUploading(false)
        setImageUploadError(errorMsg)
        toast.error(`Failed to upload image: ${errorMsg}`)
      }
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center my-5'>
        <h1 className='text-lg font-semibold lg:text-3xl'>Products Management</h1>
        <div className='flex gap-3'>
          {!editSectionMode && (
            <Button onClick={handleToggleEditSection} variant='outline'>
              Edit Section Text
            </Button>
          )}
          {!addItemMode && editItemIndex === null && (
            <Button onClick={handleAddItem} className='flex items-center gap-2'>
              <Plus size={16} /> Add Item
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

                <div className='grid md:grid-cols-2 gap-4'>
                  {/* Left Text field */}
                  <FormField
                    control={sectionForm.control}
                    name='leftText'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Left Text</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Enter left side text' {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Right Text field */}
                  <FormField
                    control={sectionForm.control}
                    name='rightText'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Right Text</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Enter right side text' {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
            {products.title && (
              <div className='mb-4'>
                <h3 className='text-sm font-semibold text-muted-foreground'>Section Title</h3>
                <p className='text-base'>{products.title}</p>
              </div>
            )}

            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-sm font-semibold text-muted-foreground'>Left Text</h3>
                <p className='text-base'>{products.leftText || 'Not set'}</p>
              </div>
              <div>
                <h3 className='text-sm font-semibold text-muted-foreground'>Right Text</h3>
                <p className='text-base'>{products.rightText || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add New Item Form */}
      {addItemMode && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Add New Product Item</CardTitle>
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
                    {/* Name field */}
                    <FormField
                      control={itemForm.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter item name' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Title field */}
                    <FormField
                      control={itemForm.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter item title' {...field} />
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
                            <Textarea placeholder='Enter item description' {...field} rows={4} />
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
                          <FormLabel>Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter item link URL' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Item Image Upload */}
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <FormLabel>Item Icon (Optional)</FormLabel>
                      {itemIcon?.file && (
                        <div className='mb-2 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative size-16'>
                            <Image
                              src={itemIcon.file}
                              alt='Item icon preview'
                              fill
                              className='object-contain'
                            />
                          </div>
                        </div>
                      )}
                      <ImageUploader
                        fileId={itemIcon?.fileId}
                        setFile={(file) => setItemIcon(file)}
                      />
                    </div>

                    <div className='space-y-2'>
                      <FormLabel>Item Thumbnail (Required)</FormLabel>
                      {itemThumbnail?.file && (
                        <div className='mb-2 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative size-24'>
                            <Image
                              src={itemThumbnail.file}
                              alt='Item thumbnail preview'
                              fill
                              className='object-contain'
                            />
                          </div>
                        </div>
                      )}
                      <ImageUploader
                        fileId={itemThumbnail?.fileId}
                        setFile={(file) => setItemThumbnail(file)}
                      />
                    </div>

                    {/* Multiple Images */}
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <FormLabel>
                          Additional Images ({itemImages.length}/{maxImagesLimit})
                        </FormLabel>
                        {itemImages.length < maxImagesLimit && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            disabled={isImageUploading}
                            onClick={() => {
                              // Directly trigger the hidden ImageUploader component
                              const additionalImageUploader = document.getElementById(
                                'add-additional-image-uploader'
                              ) as HTMLInputElement
                              if (additionalImageUploader) {
                                additionalImageUploader.click()
                              }
                            }}
                            className='text-xs flex items-center gap-1'
                          >
                            {isImageUploading ? (
                              <span className='flex items-center'>
                                <span className='h-3 w-3 mr-1 animate-spin rounded-full border border-primary border-t-transparent'></span>
                                <span>Uploading...</span>
                              </span>
                            ) : (
                              <>
                                <Plus size={14} /> Add Image
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Hidden uploader for additional images */}
                      <div className='hidden'>
                        <ImageUploader
                          id='add-additional-image-uploader'
                          onStartUpload={handleImageUpload('additional').onStartUpload}
                          setFile={handleImageUpload('additional').onComplete}
                        />
                      </div>

                      {/* Loading indicator */}
                      {isImageUploading && (
                        <div className='flex items-center justify-center py-2'>
                          <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                          <span className='ml-2 text-xs text-muted-foreground'>
                            Uploading image...
                          </span>
                        </div>
                      )}

                      {/* Error indicator */}
                      {imageUploadError && (
                        <div className='flex items-center justify-center py-2 text-destructive'>
                          <span className='text-xs'>{imageUploadError}</span>
                        </div>
                      )}

                      {/* Image gallery */}
                      {itemImages.length > 0 ? (
                        <div className='grid grid-cols-3 gap-2 mt-2'>
                          {itemImages.map((img, idx) => (
                            <div
                              key={idx}
                              className='relative border rounded-md overflow-hidden group'
                            >
                              <div className='relative aspect-square w-full'>
                                <Image
                                  src={img.file || ''}
                                  alt={`Product image ${idx + 1}`}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                              <button
                                type='button'
                                onClick={() => {
                                  setItemImages((prev) => {
                                    const newImages = [...prev]
                                    newImages.splice(idx, 1)
                                    return newImages
                                  })
                                }}
                                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className='text-xs text-muted-foreground bg-muted/20 py-2 px-3 rounded-md'>
                          No additional images added yet. (Optional)
                        </p>
                      )}
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
              {isSubmitting ? 'Saving...' : 'Add Item'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Item Form - Same style as Add Item */}
      {editItemIndex !== null && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Edit Product Item</CardTitle>
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
                    {/* Name field */}
                    <FormField
                      control={itemForm.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter item name' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Title field */}
                    <FormField
                      control={itemForm.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter item title' {...field} />
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
                            <Textarea placeholder='Enter item description' {...field} rows={4} />
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
                          <FormLabel>Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter item link URL' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Item Image Upload */}
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <FormLabel>Item Icon (Optional)</FormLabel>
                      {itemIcon?.file && (
                        <div className='mb-2 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative size-16'>
                            <Image
                              src={itemIcon.file}
                              alt='Item icon preview'
                              fill
                              className='object-contain'
                            />
                          </div>
                        </div>
                      )}
                      <ImageUploader
                        fileId={itemIcon?.fileId}
                        setFile={(file) => setItemIcon(file)}
                      />
                    </div>

                    <div className='space-y-2'>
                      <FormLabel>Item Thumbnail (Required)</FormLabel>
                      {itemThumbnail?.file && (
                        <div className='mb-2 relative max-w-xs'>
                          <div className='border rounded-md overflow-hidden relative size-24'>
                            <Image
                              src={itemThumbnail.file}
                              alt='Item thumbnail preview'
                              fill
                              className='object-contain'
                            />
                          </div>
                        </div>
                      )}
                      <ImageUploader
                        fileId={itemThumbnail?.fileId}
                        setFile={(file) => setItemThumbnail(file)}
                      />
                    </div>

                    {/* Multiple Images */}
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <FormLabel>
                          Additional Images ({itemImages.length}/{maxImagesLimit})
                        </FormLabel>
                        {itemImages.length < maxImagesLimit && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            disabled={isImageUploading}
                            onClick={() => {
                              // Directly trigger the hidden ImageUploader component
                              const additionalImageUploader = document.getElementById(
                                'edit-additional-image-uploader'
                              ) as HTMLInputElement
                              if (additionalImageUploader) {
                                additionalImageUploader.click()
                              }
                            }}
                            className='text-xs flex items-center gap-1'
                          >
                            {isImageUploading ? (
                              <span className='flex items-center'>
                                <span className='h-3 w-3 mr-1 animate-spin rounded-full border border-primary border-t-transparent'></span>
                                <span>Uploading...</span>
                              </span>
                            ) : (
                              <>
                                <Plus size={14} /> Add Image
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Hidden uploader for additional images */}
                      <div className='hidden'>
                        <ImageUploader
                          id='edit-additional-image-uploader'
                          onStartUpload={handleImageUpload('additional').onStartUpload}
                          setFile={handleImageUpload('additional').onComplete}
                        />
                      </div>

                      {/* Loading indicator */}
                      {isImageUploading && (
                        <div className='flex items-center justify-center py-2'>
                          <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                          <span className='ml-2 text-xs text-muted-foreground'>
                            Uploading image...
                          </span>
                        </div>
                      )}

                      {/* Error indicator */}
                      {imageUploadError && (
                        <div className='flex items-center justify-center py-2 text-destructive'>
                          <span className='text-xs'>{imageUploadError}</span>
                        </div>
                      )}

                      {/* Image gallery */}
                      {itemImages.length > 0 ? (
                        <div className='grid grid-cols-3 gap-2 mt-2'>
                          {itemImages.map((img, idx) => (
                            <div
                              key={idx}
                              className='relative border rounded-md overflow-hidden group'
                            >
                              <div className='relative aspect-square w-full'>
                                <Image
                                  src={img.file || ''}
                                  alt={`Product image ${idx + 1}`}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                              <button
                                type='button'
                                onClick={() => {
                                  setItemImages((prev) => {
                                    const newImages = [...prev]
                                    newImages.splice(idx, 1)
                                    return newImages
                                  })
                                }}
                                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className='text-xs text-muted-foreground bg-muted/20 py-2 px-3 rounded-md'>
                          No additional images added yet. (Optional)
                        </p>
                      )}
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
              {isSubmitting ? 'Saving...' : 'Update Item'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* List all product items */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6'>
        {products.items.length === 0 && !addItemMode && editItemIndex === null ? (
          <p className='text-muted-foreground col-span-full text-center py-10'>
            No product items added yet. Click "Add Item" to create your first product item.
          </p>
        ) : (
          products.items.map((item, index) => (
            <Card key={index} className='overflow-hidden max-w-xs'>
              {item.icon?.file && (
                <div className='relative w-full h-32'>
                  <Image
                    src={item.icon.file}
                    alt={item.title || 'Product item icon'}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <CardHeader className='p-3'>
                <CardTitle className='text-base'>{item.title}</CardTitle>
                {item.images && item.images.length > 0 && (
                  <div className='mt-1 flex items-center'>
                    <span className='text-xs text-muted-foreground flex items-center gap-1'>
                      <span className='block h-2 w-2 rounded-full bg-primary'></span>
                      {item.images.length} additional{' '}
                      {item.images.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent className='p-3 pt-0'>
                <p className='text-xs line-clamp-2'>{item.description}</p>
              </CardContent>
              <CardFooter className='flex justify-end gap-2 p-3'>
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
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
