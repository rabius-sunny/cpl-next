'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import { generateSlug } from '@/lib/utils'
import products from '@/models/Products'
import { revalidatePath } from 'next/cache'

/**
 * Server action to fetch products data
 */
export async function getProducts() {
  try {
    await connectToDatabase()

    let data = await products.find()

    if (!data) {
      data = await products.create({
        products: []
      })
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(data)) || []
    }
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch products',
      data: []
    }
  }
}

export async function getProductDetails(id: string) {
  try {
    await connectToDatabase()

    let data = await products.findById(id)

    return {
      success: true,
      data: JSON.parse(JSON.stringify(data)) || []
    }
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch products',
      data: []
    }
  }
}

/**
 * Server action to add a new product
 */
export async function addProduct(productData: any) {
  try {
    await connectToDatabase()

    const res = await products.create(productData)
    revalidatePath('/dashboard/products')

    return {
      success: true,
      message: 'Product added successfully'
    }
  } catch (error: any) {
    console.error('Error adding product:', error)
    return {
      success: false,
      error: error.message || 'Failed to add product'
    }
  }
}

/**
 * Server action to update a specific product
 */
export async function updateProduct(index: string, productData: any) {
  try {
    await connectToDatabase()

    await products.findOneAndUpdate(
      { _id: index },
      { ...productData, slug: generateSlug(productData?.name) }
    )

    revalidatePath('/dashboard/products')

    return {
      success: true,
      message: 'Product updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating product:', error)
    return {
      success: false,
      error: error.message || 'Failed to update product'
    }
  }
}

/**
 * Server action to delete a product
 */
export async function deleteProduct(index: string) {
  try {
    await connectToDatabase()

    await products.findByIdAndDelete(index)

    revalidatePath('/dashboard/products')

    return {
      success: true,
      message: 'Product deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete product'
    }
  }
}

export async function retrieveProducts(): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/get-products`, {
    next: { tags: ['products'] }
  })
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return await res.json()
}
