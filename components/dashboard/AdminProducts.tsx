'use client'

import { addProduct, deleteProduct, updateProduct } from '@/actions/data/product'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Loader2, Plus, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data: Product[]
}

// Extended Product type with index for operations
type ProductWithIndex = Product & {
  index: string
}

// Define the Zod schema for product features
const featureSchema = z.object({
  key: z.string().min(1, { message: 'Feature key is required' }),
  value: z.string().min(1, { message: 'Feature value is required' }),
  _id: z.string().optional() // For unique identification
})

// Define the Zod schema for product validation
const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Product name is required' })
    .max(100, { message: 'Product name is too long' }),
  description: z
    .string()
    .min(1, { message: 'Product description is required' })
    .max(1000, { message: 'Description is too long' }),
  features: z.array(featureSchema)
})

// Define the form type
type ProductFormValues = z.infer<typeof productSchema>

export default function AdminProducts({ data }: TProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithIndex | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | undefined>()
  const [thumbnailFile, setThumbnailFile] = useState<MediaFile | null>(null)
  const [imageFiles, setImageFiles] = useState<MediaFile[]>([])

  // Create products with index for operations
  const productsWithIndex: ProductWithIndex[] = data.map((product, index) => ({
    ...product,
    index: index.toString()
  }))

  // Initialize the form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      features: []
    },
    mode: 'onChange'
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'features'
  })

  const resetForm = () => {
    form.reset({
      name: '',
      description: '',
      features: []
    })
    setThumbnailFile(null)
    setImageFiles([])
    setEditingProduct(null)
    setServerError(undefined)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (product: ProductWithIndex) => {
    setEditingProduct(product)
    form.reset({
      name: product.name,
      description: product.description,
      features: product.features || []
    })
    setThumbnailFile(product.thumbnail || null)
    setImageFiles(product.images || [])
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    setServerError(undefined)

    try {
      // Clean the media file data to avoid circular references
      const cleanThumbnail = thumbnailFile
        ? {
          file: thumbnailFile.file,
          fileId: thumbnailFile.fileId,
          thumbnail: thumbnailFile.thumbnail
        }
        : undefined

      const cleanImages = imageFiles.map((image) => ({
        file: image.file,
        fileId: image.fileId,
        thumbnail: image.thumbnail
      }))

      const productData = {
        ...data,
        thumbnail: cleanThumbnail,
        images: cleanImages
      }

      let result
      if (editingProduct) {
        result = await updateProduct(editingProduct.index, productData)
      } else {
        result = await addProduct(productData)
      }

      if (result.success) {
        toast.success(
          editingProduct ? 'Product updated successfully!' : 'Product added successfully!'
        )
        setIsDialogOpen(false)
        resetForm()
      } else {
        setServerError(result.error || 'Failed to save product')
      }
    } catch (error) {
      setServerError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productIndex: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const result = await deleteProduct(productIndex)
      if (result.success) {
        toast.success('Product deleted successfully!')
      } else {
        toast.error(result.error || 'Failed to delete product')
      }
    } catch (error) {
      toast.error('An error occurred while deleting product')
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-bold text-2xl'>Product Management</h2>
          <p className='text-muted-foreground'>Manage your products, features, and images</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className='mr-2 w-4 h-4' />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                {serverError && <FormError message={serverError} />}

                {/* Basic Information */}
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter product name'
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter product description'
                          rows={4}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Thumbnail Upload */}
                <div className='space-y-2'>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <div className='flex items-center gap-4'>
                    <ImageUploader
                      fileId={thumbnailFile?.fileId}
                      setFile={setThumbnailFile}
                      id='thumbnail'
                    />
                    {thumbnailFile?.thumbnail && (
                      <div className='relative w-20 h-20'>
                        <Image
                          src={thumbnailFile.thumbnail}
                          alt='Thumbnail'
                          fill
                          className='border rounded-md object-cover'
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery Images */}
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <FormLabel>Gallery Images</FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        // Add a placeholder for new image upload
                        setImageFiles((prev) => [...prev, { file: '', fileId: '', thumbnail: '' }])
                      }}
                    >
                      <Plus className='mr-2 w-4 h-4' />
                      Add Gallery Image
                    </Button>
                  </div>
                  <div className='space-y-4'>
                    {imageFiles.map((image, index) => (
                      <div key={index} className='flex items-center gap-4 p-4 border rounded-lg'>
                        {image.thumbnail ? (
                          <div className='relative w-16 h-16'>
                            <Image
                              src={image.thumbnail}
                              alt={`Gallery ${index + 1}`}
                              fill
                              className='rounded-md object-cover'
                            />
                          </div>
                        ) : (
                          <div className='flex justify-center items-center bg-muted rounded-md w-16 h-16'>
                            <Upload className='w-6 h-6 text-muted-foreground' />
                          </div>
                        )}
                        <div className='flex-1 space-y-2'>
                          <p className='font-medium text-sm'>Gallery Image {index + 1}</p>
                          <div className='flex items-center gap-2'>
                            <ImageUploader
                              fileId={image.fileId}
                              setFile={(file) => {
                                const newImages = [...imageFiles]
                                newImages[index] = file
                                setImageFiles(newImages)
                              }}
                              id={`gallery-${index}`}
                            />
                            {!image.thumbnail && (
                              <span className='text-muted-foreground text-xs'>
                                Choose image file
                              </span>
                            )}
                          </div>
                        </div>
                        <div className='flex gap-2'>
                          {index > 0 && (
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const newImages = [...imageFiles]
                                const temp = newImages[index]
                                newImages[index] = newImages[index - 1]
                                newImages[index - 1] = temp
                                setImageFiles(newImages)
                              }}
                              title='Move up'
                            >
                              ↑
                            </Button>
                          )}
                          {index < imageFiles.length - 1 && (
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const newImages = [...imageFiles]
                                const temp = newImages[index]
                                newImages[index] = newImages[index + 1]
                                newImages[index + 1] = temp
                                setImageFiles(newImages)
                              }}
                              title='Move down'
                            >
                              ↓
                            </Button>
                          )}
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              const newImages = [...imageFiles]
                              newImages.splice(index, 1)
                              setImageFiles(newImages)
                            }}
                            title='Remove image'
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {imageFiles.length === 0 && (
                      <div className='py-8 text-muted-foreground text-center'>
                        <Upload className='opacity-50 mx-auto mb-4 w-12 h-12' />
                        <p className='text-sm'>No gallery images yet</p>
                        <p className='text-xs'>Click "Add Gallery Image" to get started</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <FormLabel>Product Features</FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => append({ key: '', value: '' })}
                    >
                      <Plus className='mr-2 w-4 h-4' />
                      Add Feature
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className='flex items-center gap-2'>
                      <FormField
                        control={form.control}
                        name={`features.${index}.key`}
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormControl>
                              <Input
                                placeholder='Feature name'
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`features.${index}.value`}
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormControl>
                              <Input
                                placeholder='Feature value'
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className='flex justify-end gap-2 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                        {editingProduct ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>{editingProduct ? 'Update Product' : 'Add Product'}</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      {data.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col justify-center items-center py-12'>
            <Upload className='mb-4 w-12 h-12 text-muted-foreground' />
            <h3 className='mb-2 font-semibold text-lg'>No products yet</h3>
            <p className='mb-4 text-muted-foreground text-center'>
              Get started by adding your first product
            </p>
            <Button onClick={openAddDialog}>
              <Plus className='mr-2 w-4 h-4' />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {productsWithIndex.map((product) => (
            <Card key={product.index} className='overflow-hidden'>
              <CardHeader className='p-0'>
                {product.thumbnail?.thumbnail ? (
                  <div className='relative w-full h-48'>
                    <Image
                      src={product.thumbnail.thumbnail}
                      alt={product.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='flex justify-center items-center bg-muted w-full h-48'>
                    <Upload className='w-8 h-8 text-muted-foreground' />
                  </div>
                )}
              </CardHeader>
              <CardContent className='p-4'>
                <CardTitle className='mb-2 line-clamp-1'>{product.name}</CardTitle>
                <p className='mb-3 text-muted-foreground text-sm line-clamp-2'>
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <div className='space-y-1'>
                    <p className='font-medium text-muted-foreground text-xs'>Features:</p>
                    <div className='space-y-1'>
                      {product.features.slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className='text-xs'>
                          <span className='font-medium'>{feature.key}:</span> {feature.value}
                        </div>
                      ))}
                      {product.features.length > 3 && (
                        <p className='text-muted-foreground text-xs'>
                          +{product.features.length - 3} more features
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {product.images && product.images.length > 0 && (
                  <div className='mt-3'>
                    <p className='mb-1 font-medium text-muted-foreground text-xs'>
                      Gallery: {product.images.length} images
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className='flex gap-2 p-4 pt-0'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1'
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className='mr-2 w-4 h-4' />
                  Edit
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDeleteProduct(product.index)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
