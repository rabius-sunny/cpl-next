'use client'

import { createPage, deletePage, getPages, updatePage } from '@/actions/data/pages'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function usePages() {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    setLoading(true)
    try {
      const result = await getPages()
      if (result.success && result.data) {
        setPages(result.data)
      }
    } catch (error) {
      console.error('Error loading pages:', error)
      toast.error('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const createNewPage = async (title: string, slug: string) => {
    if (!title.trim() || !slug.trim()) {
      toast.error('Please provide both title and slug')
      return null
    }

    setLoading(true)
    try {
      const result = await createPage(title, slug)
      if (result.success && result.data) {
        setPages((prev) => [result.data, ...prev])
        toast.success('Page created successfully')
        return result.data
      } else {
        toast.error(result.error || 'Failed to create page')
        return null
      }
    } catch (error) {
      console.error('Error creating page:', error)
      toast.error('Failed to create page')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updatePageMetadata = async (pageId: string, title: string, slug: string) => {
    if (!title.trim() || !slug.trim()) {
      toast.error('Please provide both title and slug')
      return null
    }

    setLoading(true)
    try {
      const result = await updatePage(pageId, { title, slug })
      if (result.success && result.data) {
        setPages((prev) => prev.map((page) => (page._id === pageId ? result.data : page)))
        toast.success('Page updated successfully')
        return result.data
      } else {
        toast.error(result.error || 'Failed to update page')
        return null
      }
    } catch (error) {
      console.error('Error updating page:', error)
      toast.error('Failed to update page')
      return null
    } finally {
      setLoading(false)
    }
  }

  const togglePagePublish = async (page: CustomPage) => {
    setLoading(true)
    try {
      const newPublishState = !page.isPublished
      const result = await updatePage(page._id!, { isPublished: newPublishState })
      if (result.success) {
        setPages((prev) =>
          prev.map((p) => (p._id === page._id ? { ...p, isPublished: newPublishState } : p))
        )
        toast.success(`Page ${newPublishState ? 'published' : 'unpublished'} successfully`)
        return { ...page, isPublished: newPublishState }
      } else {
        toast.error(result.error || 'Failed to update page')
        return page
      }
    } catch (error) {
      console.error('Error updating page:', error)
      toast.error('Failed to update page')
      return page
    } finally {
      setLoading(false)
    }
  }

  const deletePageHandler = async (pageId: string, pageTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${pageTitle}"? This action cannot be undone.`
    )

    if (!confirmed) return false

    setLoading(true)
    try {
      const result = await deletePage(pageId)
      if (result.success) {
        setPages((prev) => prev.filter((page) => page._id !== pageId))
        toast.success('Page deleted successfully')
        return true
      } else {
        toast.error(result.error || 'Failed to delete page')
        return false
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      toast.error('Failed to delete page')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    pages,
    loading,
    createNewPage,
    updatePageMetadata,
    togglePagePublish,
    deletePageHandler,
    refreshPages: loadPages
  }
}
