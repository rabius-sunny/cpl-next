'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import products from '@/models/Products'
import { revalidatePath } from 'next/cache'

/**
 * Server action to fetch products data
 */
export async function getProducts() {
  try {
    await connectToDatabase()

    let data = await products.findOne()

    if (!data) {
      data = await products.create({
        products: []
      })
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(data?.products)) || []
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

/**
 * Server action to update products data
 */
export async function updateProducts(newProducts: any[]) {
  try {
    await connectToDatabase()

    let data = await products.findOne()

    if (!data) {
      data = await products.create({
        products: newProducts
      })
    } else {
      data.products = newProducts
      await data.save()
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(data?.products)) || []
    }
  } catch (error: any) {
    console.error('Error updating products:', error)
    return {
      success: false,
      error: error.message || 'Failed to update products'
    }
  }
}

/**
 * Server action to add a new product
 */
export async function addProduct(productData: any) {
  try {
    console.log('Adding product with data:', JSON.stringify(productData, null, 2))
    await connectToDatabase()

    let data = await products.findOne()

    if (!data) {
      data = await products.create({
        products: [productData]
      })
    } else {
      data.products.push(productData)
      await data.save()
    }

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
export async function updateProduct(index: number, productData: any) {
  try {
    console.log(
      'Updating product at index:',
      index,
      'with data:',
      JSON.stringify(productData, null, 2)
    )
    await connectToDatabase()

    let data = await products.findOne()

    if (!data || !data.products[index]) {
      return {
        success: false,
        error: 'Product not found'
      }
    }

    data.products[index] = productData
    await data.save()

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
export async function deleteProduct(index: number) {
  try {
    await connectToDatabase()

    let data = await products.findOne()

    if (!data || !data.products[index]) {
      return {
        success: false,
        error: 'Product not found'
      }
    }

    data.products.splice(index, 1)
    await data.save()

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
