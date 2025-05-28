'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SocialIcon from '@/components/ui/SocialIcon'
import React, { memo, useCallback, useMemo, useState } from 'react'

interface SocialLink {
  network: string
  link: string
}

interface SocialLinksEditorProps {
  initialLinks: SocialLink[]
}

// Memoized component for each social link row to prevent unnecessary re-renders
const SocialLinkRow = memo(
  ({
    link,
    index,
    updateLink,
    removeLink
  }: {
    link: SocialLink
    index: number
    updateLink: (index: number, field: keyof SocialLink, value: string) => void
    removeLink: (index: number) => void
  }) => {
    // Create memoized handlers to prevent recreating functions on each render
    const handleNetworkChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateLink(index, 'network', e.target.value)
      },
      [index, updateLink]
    )

    const handleLinkChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateLink(index, 'link', e.target.value)
      },
      [index, updateLink]
    )

    const handleRemove = useCallback(() => {
      removeLink(index)
    }, [index, removeLink])

    return (
      <div className='flex items-center space-x-4'>
        <div className='w-1/3'>
          <Label htmlFor={`network-${index}`}>Platform</Label>
          <div className='flex items-center space-x-2'>
            <SocialIcon network={link.network || 'default'} size={20} />
            <Input
              id={`network-${index}`}
              placeholder='facebook, twitter, etc.'
              value={link.network}
              onChange={handleNetworkChange}
            />
          </div>
        </div>

        <div className='flex-1'>
          <Label htmlFor={`link-${index}`}>URL</Label>
          <Input
            id={`link-${index}`}
            placeholder='https://...'
            value={link.link}
            onChange={handleLinkChange}
          />
        </div>

        <Button type='button' variant='destructive' onClick={handleRemove} className='mt-6'>
          Remove
        </Button>
      </div>
    )
  }
)

// Add a display name for React DevTools
SocialLinkRow.displayName = 'SocialLinkRow'

const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({ initialLinks = [] }) => {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [isLoading, setIsLoading] = useState(false)

  // Use memoized callbacks to prevent recreating functions on each render
  const addNewLink = useCallback(() => {
    setLinks((prevLinks) => [...prevLinks, { network: '', link: '' }])
  }, [])

  const updateLink = useCallback((index: number, field: keyof SocialLink, value: string) => {
    setLinks((prevLinks) => {
      const updatedLinks = [...prevLinks]
      updatedLinks[index][field] = value
      return updatedLinks
    })
  }, [])

  const removeLink = useCallback((index: number) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      try {
        // Filter out empty links
        const filteredLinks = links.filter((link) => link.network && link.link)

        // Show success message or notification
        console.log('Social links updated successfully', filteredLinks)
      } catch (error) {
        console.error('Failed to update social links:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [links]
  )

  // Memoize the link list to avoid unnecessary re-renders
  const socialLinksList = useMemo(() => {
    return links.map((link, index) => (
      <SocialLinkRow
        key={index}
        link={link}
        index={index}
        updateLink={updateLink}
        removeLink={removeLink}
      />
    ))
  }, [links, updateLink, removeLink])

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>Social Media Links</h2>

        {socialLinksList}
      </div>

      <div className='flex space-x-4'>
        <Button type='button' variant='outline' onClick={addNewLink}>
          Add Social Link
        </Button>

        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Social Links'}
        </Button>
      </div>
    </form>
  )
}

export default SocialLinksEditor
