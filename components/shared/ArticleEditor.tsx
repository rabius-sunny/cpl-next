'use client'

import Editor from '@/components/shared/Editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(200, 'Excerpt must be less than 200 characters').optional()
})

type ArticleForm = z.infer<typeof articleSchema>

export default function ArticleEditor() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      author: '',
      content: '',
      excerpt: ''
    }
  })

  const onSubmit = async (data: ArticleForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('Article Data:', {
        ...data,
        content,
        wordCount: content.replace(/<[^>]*>/g, '').split(' ').length,
        publishedAt: new Date().toISOString()
      })

      toast.success('Article saved successfully!')
    } catch (error) {
      toast.error('Failed to save article')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setValue('content', newContent)

    // Auto-generate excerpt from content if not provided
    const plainText = newContent.replace(/<[^>]*>/g, '')
    if (plainText.length > 0 && !watch('excerpt')) {
      const autoExcerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '')
      setValue('excerpt', autoExcerpt)
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Article Editor</CardTitle>
          <CardDescription>Create and edit articles with our rich text editor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  {...register('title')}
                  placeholder='Enter article title'
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className='text-red-500 text-sm'>{errors.title.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='author'>Author</Label>
                <Input
                  id='author'
                  {...register('author')}
                  placeholder='Enter author name'
                  className={errors.author ? 'border-red-500' : ''}
                />
                {errors.author && <p className='text-red-500 text-sm'>{errors.author.message}</p>}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='excerpt'>Excerpt (Optional)</Label>
              <Input
                id='excerpt'
                {...register('excerpt')}
                placeholder='Brief description of the article'
                className={errors.excerpt ? 'border-red-500' : ''}
              />
              {errors.excerpt && <p className='text-red-500 text-sm'>{errors.excerpt.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label>Content</Label>
              <Editor
                content={content}
                onChange={handleContentChange}
                placeholder='Start writing your article...'
                className='min-h-[500px]'
              />
              {errors.content && <p className='text-red-500 text-sm'>{errors.content.message}</p>}
            </div>

            <div className='flex justify-between items-center'>
              <div className='text-sm text-gray-500'>
                {content && (
                  <>
                    Words:{' '}
                    {
                      content
                        .replace(/<[^>]*>/g, '')
                        .split(' ')
                        .filter((word) => word.length > 0).length
                    }{' '}
                    | Characters: {content.replace(/<[^>]*>/g, '').length}
                  </>
                )}
              </div>

              <div className='flex gap-2'>
                <Button type='button' variant='outline'>
                  Save Draft
                </Button>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? 'Publishing...' : 'Publish Article'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {content && (
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>How your article will appear to readers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='prose prose-lg max-w-none'>
              <h1>{watch('title') || 'Untitled Article'}</h1>
              <p className='text-gray-600 italic'>By {watch('author') || 'Unknown Author'}</p>
              {watch('excerpt') && (
                <p className='text-lg text-gray-700 border-l-4 border-blue-500 pl-4 my-4'>
                  {watch('excerpt')}
                </p>
              )}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
