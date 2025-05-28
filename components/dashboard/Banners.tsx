'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { ArrowLeft, Edit, PackagePlus, Plus, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: BannersSection[]
}

// Define the Zod schema for product features
const featureSchema = z.object({
  key: z.string().min(1, { message: 'Feature key is required' }),
  value: z.string().min(1, { message: 'Feature value is required' }),
  _id: z.string().optional() // For unique identification
})

// Define the Zod schema for product
const productSchema = z.object({
  description: z.string().min(1, { message: 'Product description is required' }),
  features: z.array(featureSchema).optional().default([]),
  images: z.array(z.any()).optional().default([]),
  _id: z.string().optional() // For unique identification
})

// Define the Zod schema for validation
const bannerSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  subTitle: z
    .string()
    .min(1, { message: 'Subtitle is required' })
    .max(100, { message: 'Subtitle is too long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Description is too long' }),
  product: productSchema.optional()
})

// Define constants
const MAX_PRODUCT_IMAGES = 5

export default function Banners({ data }: TProps) {
  const [banners, setBanners] = useState<BannersSection[]>(data || [])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [bannerImage, setBannerImage] = useState<MediaFile | undefined>(undefined)
  const [productImageMaps, setProductImageMaps] = useState<{ [key: string]: MediaFile[] }>({})
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null)

  // Create form with default values
  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      subTitle: '',
      description: '',
      product: {
        description: '',
        features: [],
        images: []
      }
    },
    mode: 'onBlur'
  }) as any

  // Setup field array for product features
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature
  } = useFieldArray({
    control: form.control,
    name: 'product.features'
  })

  // Helper to generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9)

  // Reset form and state
  const resetForm = () => {
    form.reset({
      title: '',
      subTitle: '',
      description: '',
      product: {
        description: '',
        features: [],
        images: []
      }
    })
    setBannerImage(undefined)
    setProductImageMaps({})
    setEditIndex(null)
    setError(null)
  }

  // Handle creating a new banner
  const handleAddBanner = () => {
    resetForm()
    setIsEditing(true)
  }

  // Handle editing an existing banner
  const handleEditBanner = (banner: BannersSection, index: number) => {
    setEditIndex(index)
    setBannerImage(banner.image)

    // Setup initial product images
    const productImgMap: { [key: string]: MediaFile[] } = {}
    const productId = generateId()

    if (banner.product?.images && banner.product.images.length > 0) {
      productImgMap[productId] = banner.product.images
    }

    // Add _id to features if they don't have one
    let featuresWithIds: any[] = []
    if (banner.product?.features) {
      featuresWithIds = banner.product.features.map((feature) => ({
        ...feature,
        _id: (feature as any)._id || generateId()
      }))
    }

    setProductImageMaps(productImgMap)

    form.reset({
      title: banner.title || '',
      subTitle: banner.subTitle || '',
      description: banner.description || '',
      product: banner.product
        ? {
            ...banner.product,
            _id: productId,
            features: featuresWithIds
          }
        : {
            description: '',
            features: [],
            _id: productId
          }
    })

    setIsEditing(true)
  }

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false)
    resetForm()
  }

  // Add a new feature to the product
  const addFeatureToProduct = () => {
    appendFeature({
      key: '',
      value: '',
      _id: generateId()
    })
  }

  // Handle image upload for a product
  const handleProductImageUpload = (productId: string, file: MediaFile) => {
    // Reset uploading status
    setUploadingProductId(null)

    setProductImageMaps((prev) => {
      const images = prev[productId] || []
      return {
        ...prev,
        [productId]: [...images, file]
      }
    })
  }

  // Remove an image from a product
  const removeProductImage = (productId: string, index: number) => {
    setProductImageMaps((prev) => {
      const images = [...(prev[productId] || [])]
      images.splice(index, 1)
      return {
        ...prev,
        [productId]: images
      }
    })
  }

  // Delete a banner
  const handleDeleteBanner = async (index: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    const newBanners = [...banners]
    newBanners.splice(index, 1)

    try {
      setIsSubmitting(true)
      const result = await updateHomepageSection('banners', newBanners)

      if (result.success) {
        setBanners(newBanners)
        toast.success('Banner deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit handler for form
  const onSubmit = async (values: any) => {
    if (!bannerImage) {
      setError('Banner image is required')
      return
    }

    // Check if product has been added without images
    const productId = values.product?._id || ''
    const hasProductDescription = values.product?.description?.trim()
    const hasNoProductImages =
      !productImageMaps[productId] || productImageMaps[productId].length === 0

    if (hasProductDescription && hasNoProductImages) {
      setError('Product must have at least one image')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      // Process product with its images if it exists
      let processedProduct = undefined

      if (values.product?.description?.trim()) {
        // Get images for this product using its _id
        const productImages = productImageMaps[productId] || []

        // Skip empty features (where key or value is empty)
        const validFeatures =
          values.product.features?.filter((f: any) => f.key?.trim() && f.value?.trim()) || []

        // Clean up features and images (remove _id from final data for MongoDB)
        const features = validFeatures.map(({ key, value }: { key: string; value: string }) => ({
          key: key.trim(),
          value: value.trim()
        }))

        processedProduct = {
          description: values.product.description.trim(),
          features,
          images: productImages
        }
      }

      // Prepare banner data
      const bannerData: BannersSection = {
        title: values.title.trim(),
        subTitle: values.subTitle.trim(),
        description: values.description.trim(),
        image: bannerImage,
        product: processedProduct
      }

      let newBanners: BannersSection[]

      if (editIndex !== null) {
        // Update existing banner
        newBanners = [...banners]
        newBanners[editIndex] = bannerData
      } else {
        // Add new banner
        newBanners = [...banners, bannerData]
      }

      console.log('new banners', newBanners)

      // Call the server action to update banners
      const result = await updateHomepageSection('banners', newBanners)

      if (result.success) {
        // Update state
        setBanners(newBanners)
        // Exit editing mode
        setIsEditing(false)
        // Reset form
        resetForm()
        // Show success toast
        toast.success(
          editIndex !== null ? 'Banner updated successfully' : 'Banner added successfully'
        )
      } else {
        setError(result.error || 'An error occurred while saving the banner')
      }
    } catch (err) {
      console.error('Error saving banner:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center my-5'>
        <h1 className='text-lg font-semibold lg:text-3xl'>Banners Management</h1>
        {!isEditing && (
          <Button onClick={handleAddBanner} className='flex items-center gap-2'>
            <Plus size={16} /> Add Banner
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className='bg-card border rounded-lg p-6 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-medium'>
              {editIndex !== null ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <Button
              variant='outline'
              size='sm'
              onClick={handleCancel}
              className='flex items-center gap-1'
            >
              <ArrowLeft size={16} /> Back to List
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {error && <FormError message={error} />}

              {/* Banner Information Section */}
              <div className='space-y-4 mb-6'>
                <h3 className='text-lg font-medium'>Banner Information</h3>

                {/* Title field */}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter banner title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subtitle field */}
                <FormField
                  control={form.control}
                  name='subTitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter banner subtitle' {...field} />
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
                        <Textarea placeholder='Enter banner description' {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Banner Image Upload */}
                <div className='space-y-2'>
                  <FormLabel>Banner Image</FormLabel>

                  {/* Image preview */}
                  {bannerImage?.file && (
                    <div className='mb-4 relative max-w-xs'>
                      <div className='border rounded-md overflow-hidden relative aspect-video w-full'>
                        <Image
                          src={bannerImage.file}
                          alt='Banner image preview'
                          fill
                          className='object-cover'
                        />
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>Banner image</p>
                    </div>
                  )}

                  {/* Image uploader component */}
                  <ImageUploader
                    fileId={bannerImage?.fileId}
                    setFile={(file) => setBannerImage(file)}
                  />
                  <p className='text-xs text-muted-foreground'>
                    Upload an image for the banner. Recommended size: 1200x600px.
                  </p>
                </div>
              </div>

              <Separator className='my-6' />

              {/* Product Section */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium'>Product</h3>
                </div>

                <div className='border rounded-md p-4 space-y-4'>
                  {/* Product description */}
                  <FormField
                    control={form.control}
                    name='product.description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Product description' {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Features */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Features</FormLabel>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={addFeatureToProduct}
                        className='h-7 text-xs'
                      >
                        <Plus size={14} className='mr-1' /> Add Feature
                      </Button>
                    </div>

                    {featureFields.length === 0 ? (
                      <p className='text-xs text-muted-foreground'>
                        No features added. Click "Add Feature" to create one.
                      </p>
                    ) : (
                      <div className='space-y-2'>
                        {featureFields.map((featureField, featureIndex) => (
                          <div key={featureField.id} className='flex items-start gap-2'>
                            <div className='flex-1'>
                              <FormField
                                control={form.control}
                                name={`product.features.${featureIndex}.key`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder='Feature name'
                                        {...field}
                                        className='text-sm'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className='flex-1'>
                              <FormField
                                control={form.control}
                                name={`product.features.${featureIndex}.value`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder='Feature value'
                                        {...field}
                                        className='text-sm'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => removeFeature(featureIndex)}
                              className='h-10 w-10 p-0'
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Images */}
                  <div className='space-y-2'>
                    {(() => {
                      const productId = form.watch('product._id') || ''
                      const productImages = productImageMaps[productId] || []

                      return (
                        <>
                          <div className='flex items-center justify-between'>
                            <FormLabel>
                              Product Images ({productImages.length}/{MAX_PRODUCT_IMAGES})
                            </FormLabel>
                            {productImages.length < MAX_PRODUCT_IMAGES && (
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                className='h-7 text-xs'
                                disabled={uploadingProductId === productId}
                                onClick={() => {
                                  // Trigger the ImageUploader component
                                  const uploadBtn = document.getElementById(
                                    `product-image-upload-${productId}`
                                  )
                                  if (uploadBtn) {
                                    uploadBtn.click()
                                  }
                                }}
                              >
                                {uploadingProductId === productId ? (
                                  <>
                                    <div className='animate-spin h-3 w-3 rounded-full border-b border-white mr-1'></div>
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus size={14} className='mr-1' /> Add Image
                                  </>
                                )}
                              </Button>
                            )}
                          </div>

                          {/* Image preview grid */}
                          {uploadingProductId === productId ? (
                            <div className='text-center py-8 text-sm bg-muted/20 rounded-md flex flex-col items-center justify-center'>
                              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2'></div>
                              <p className='text-primary font-medium'>Uploading image...</p>
                            </div>
                          ) : productImages.length > 0 ? (
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-2'>
                              {productImages.map((img, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className='relative border rounded-md overflow-hidden group'
                                >
                                  <div className='relative aspect-square w-ful'>
                                    <Image
                                      src={img.file || ''}
                                      alt={`Product image ${imgIndex + 1}`}
                                      fill
                                      className='object-cover'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    onClick={() => removeProductImage(productId, imgIndex)}
                                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className='text-center py-4 text-sm text-muted-foreground bg-muted/20 rounded-md'>
                              No images added yet. Click "Add Image" to upload.
                            </div>
                          )}

                          {productImages.length < MAX_PRODUCT_IMAGES && (
                            <div className='flex items-center gap-2'>
                              <div className='hidden'>
                                <ImageUploader
                                  id={`product-image-upload-${productId}`}
                                  setFile={(file) => handleProductImageUpload(productId, file)}
                                  onStartUpload={() => setUploadingProductId(productId)}
                                />
                              </div>
                            </div>
                          )}
                          <p className='text-xs text-muted-foreground'>
                            Upload up to {MAX_PRODUCT_IMAGES} images for this product. Recommended
                            size: 800x800px.
                          </p>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-6'>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editIndex !== null ? 'Update Banner' : 'Add Banner'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-6'>
          {banners.length === 0 ? (
            <p className='text-muted-foreground col-span-full text-center py-10'>
              No banners added yet. Click "Add Banner" to create your first banner.
            </p>
          ) : (
            banners.map((banner, index) => (
              <Card key={index} className='overflow-hidden'>
                {banner.image?.file && (
                  <div className='relative w-full h-40'>
                    <Image
                      src={banner.image.file}
                      alt={banner.title || 'Banner image'}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}
                <div className='p-3 space-y-2'>
                  <div className='font-semibold'>{banner.title}</div>
                  <div className='text-xs text-muted-foreground'>{banner.subTitle}</div>
                  <p className='text-xs line-clamp-2'>{banner.description}</p>

                  {/* Product indicator */}
                  {banner.product && (
                    <Badge variant='outline' className='flex items-center gap-1'>
                      <PackagePlus size={12} />
                      Product
                    </Badge>
                  )}

                  <div className='flex justify-end gap-2 pt-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEditBanner(banner, index)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDeleteBanner(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
