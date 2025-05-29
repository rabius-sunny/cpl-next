'use client'

import { getPageById, updatePageSections } from '@/actions/data/pages'
import { useState } from 'react'
import { toast } from 'sonner'

export function useCurrentPage() {
  const [currentPage, setCurrentPage] = useState<CustomPage | null>(null)
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadPage = async (pageId: string) => {
    setLoading(true)
    try {
      const result = await getPageById(pageId)
      if (result.success && result.data) {
        setCurrentPage(result.data)
        setSections(result.data.sections || [])
        return result.data
      }
    } catch (error) {
      console.error('Error loading page:', error)
      toast.error('Failed to load page')
    } finally {
      setLoading(false)
    }
    return null
  }

  const savePage = async () => {
    if (!currentPage) {
      toast.error('No page selected')
      return false
    }

    setSaving(true)
    try {
      const result = await updatePageSections(currentPage._id!, sections)
      if (result.success) {
        toast.success('Page saved successfully')
        return true
      } else {
        toast.error(result.error || 'Failed to save page')
        return false
      }
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error('Failed to save page')
      return false
    } finally {
      setSaving(false)
    }
  }

  const addSection = (type: PageSection['type'], position?: number) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      order: position ?? sections.length,
      data: getDefaultDataForType(type)
    }

    if (position !== undefined && position < sections.length) {
      // Insert at specific position
      setSections((prev) => {
        const newSections = [...prev]
        newSections.splice(position, 0, newSection)
        // Update order for all sections
        return newSections.map((section, i) => ({ ...section, order: i }))
      })
    } else {
      // Add at the end
      setSections((prev) => [...prev, newSection])
    }
  }

  const updateSection = (sectionId: string, data: any) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, data } : section))
    )
  }

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId))
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    setSections((prev) => {
      const newSections = [...prev]
      const temp = newSections[index]
      newSections[index] = newSections[index - 1]
      newSections[index - 1] = temp
      return newSections.map((section, i) => ({ ...section, order: i }))
    })
  }

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return
    setSections((prev) => {
      const newSections = [...prev]
      const temp = newSections[index]
      newSections[index] = newSections[index + 1]
      newSections[index + 1] = temp
      return newSections.map((section, i) => ({ ...section, order: i }))
    })
  }

  const clearCurrentPage = () => {
    setCurrentPage(null)
    setSections([])
  }

  return {
    currentPage,
    sections,
    loading,
    saving,
    loadPage,
    savePage,
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    clearCurrentPage,
    setCurrentPage,
    setSections
  }
}

function getDefaultDataForType(type: PageSection['type']) {
  switch (type) {
    case 'header-banner':
      return { title: '', subtitle: '' }
    case 'content-section':
      return { title: '', content: '' }
    case 'grid-layout':
      return { title: '', columns: 3, items: [] }
    case 'image-text':
      return { title: '', content: '', imagePosition: 'left' }
    case 'bottom-media':
      return { type: 'image', title: '', description: '' }
    default:
      return {}
  }
}
