'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import Pages from '@/models/Pages'
import { revalidatePath } from 'next/cache'

export async function createPage(title: string, slug: string) {
  try {
    await connectToDatabase()

    const newPage = new Pages({
      title,
      slug,
      sections: [],
      isPublished: false
    })

    await newPage.save()
    revalidatePath('/dashboard/custom')

    return { success: true, data: JSON.parse(JSON.stringify(newPage)) }
  } catch (error) {
    console.error('Error creating page:', error)
    return { success: false, error: 'Failed to create page' }
  }
}

export async function updatePage(pageId: string, data: Partial<CustomPage>) {
  try {
    await connectToDatabase()

    const updatedPage = await Pages.findByIdAndUpdate(pageId, data, { new: true })

    if (!updatedPage) {
      return { success: false, error: 'Page not found' }
    }

    revalidatePath('/dashboard/custom')

    return { success: true, data: JSON.parse(JSON.stringify(updatedPage)) }
  } catch (error) {
    console.error('Error updating page:', error)
    return { success: false, error: 'Failed to update page' }
  }
}

export async function deletePage(pageId: string) {
  try {
    await connectToDatabase()

    await Pages.findByIdAndDelete(pageId)
    revalidatePath('/dashboard/custom')

    return { success: true }
  } catch (error) {
    console.error('Error deleting page:', error)
    return { success: false, error: 'Failed to delete page' }
  }
}

export async function getPages() {
  try {
    await connectToDatabase()

    const pages = await Pages.find().sort({ createdAt: -1 })

    return { success: true, data: JSON.parse(JSON.stringify(pages)) }
  } catch (error) {
    console.error('Error fetching pages:', error)
    return { success: false, error: 'Failed to fetch pages' }
  }
}

export async function getPageById(pageId: string) {
  try {
    await connectToDatabase()

    const page = await Pages.findById(pageId)

    if (!page) {
      return { success: false, error: 'Page not found' }
    }

    return { success: true, data: JSON.parse(JSON.stringify(page)) }
  } catch (error) {
    console.error('Error fetching page:', error)
    return { success: false, error: 'Failed to fetch page' }
  }
}

export async function updatePageSections(pageId: string, sections: PageSection[]) {
  try {
    await connectToDatabase()

    const updatedPage = await Pages.findByIdAndUpdate(pageId, { sections }, { new: true })

    if (!updatedPage) {
      return { success: false, error: 'Page not found' }
    }

    revalidatePath('/dashboard/custom')

    return { success: true, data: JSON.parse(JSON.stringify(updatedPage)) }
  } catch (error) {
    console.error('Error updating page sections:', error)
    return { success: false, error: 'Failed to update page sections' }
  }
}

export async function getPageBySlug(slug: string) {
  try {
    await connectToDatabase()

    const page = await Pages.findOne({ slug })

    if (!page) {
      return { success: false, error: 'Page not found' }
    }

    return { success: true, data: JSON.parse(JSON.stringify(page)) }
  } catch (error) {
    console.error('Error fetching page by slug:', error)
    return { success: false, error: 'Failed to fetch page' }
  }
}
