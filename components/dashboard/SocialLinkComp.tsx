import { Plus, Trash2 } from 'lucide-react'
import { SOCIAL_PLATFORMS } from '../others/social-platform'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

// Define the types for social links
type SocialLink = {
  icon: string
  link: string
  _id: string
}

// Social link item component
export function SocialLinkItem({
  icon,
  link,
  onIconChange,
  onLinkChange,
  onRemove
}: {
  icon: string
  link: string
  onIconChange: (value: string) => void
  onLinkChange: (value: string) => void
  onRemove: () => void
}) {
  return (
    <div className='flex gap-2 items-end'>
      {/* Social Platform */}
      <div className='flex-1'>
        <Select defaultValue={icon} onValueChange={onIconChange}>
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Platform'>
              {icon && (
                <div className='flex items-center gap-2'>
                  <span className='capitalize'>{icon}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SOCIAL_PLATFORMS.map((platform) => (
              <SelectItem key={platform} value={platform}>
                <div className='flex items-center gap-2'>
                  <span className='capitalize'>{platform}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Social Link */}
      <div className='flex-2'>
        <Input
          placeholder='https://...'
          defaultValue={link}
          onBlur={(e) => onLinkChange(e.target.value)}
        />
      </div>

      {/* Remove Link Button */}
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='size-6 bg-red-100 text-destructive hover:text-white cursor-pointer hover:bg-destructive'
        onClick={onRemove}
      >
        <Trash2 className='size-3' />
      </Button>
    </div>
  )
}

// Social links section component
export function SocialLinksSection({
  socialLinks,
  onSocialLinksChange
}: {
  socialLinks: SocialLink[]
  onSocialLinksChange: (links: SocialLink[]) => void
}) {
  const addSocialLink = () => {
    onSocialLinksChange([
      ...socialLinks,
      {
        icon: 'facebook',
        link: '',
        _id: Math.random().toString(36).substring(2, 9)
      }
    ])
  }

  const updateSocialLink = (index: number, field: 'icon' | 'link', value: string) => {
    const updatedLinks = [...socialLinks]
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    }
    onSocialLinksChange(updatedLinks)
  }

  const removeSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks]
    updatedLinks.splice(index, 1)
    onSocialLinksChange(updatedLinks)
  }

  return (
    <div className='space-y-3'>
      <div className='flex justify-between items-center'>
        <Label>Social Media Links</Label>

        <Button type='button' variant='outline' size='sm' onClick={addSocialLink}>
          <Plus className='h-3 w-3 mr-1' />
          Add Link
        </Button>
      </div>

      <div className='space-y-2'>
        {socialLinks.map((socialLink, index) => (
          <SocialLinkItem
            key={socialLink._id}
            icon={socialLink.icon}
            link={socialLink.link}
            onIconChange={(value) => updateSocialLink(index, 'icon', value)}
            onLinkChange={(value) => updateSocialLink(index, 'link', value)}
            onRemove={() => removeSocialLink(index)}
          />
        ))}

        {(!socialLinks || socialLinks.length === 0) && (
          <div className='text-sm text-muted-foreground py-2'>
            No social links added. Click "Add Link" to add social media profiles.
          </div>
        )}
      </div>
    </div>
  )
}
