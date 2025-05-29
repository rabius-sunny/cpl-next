'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useRef, useState } from 'react'

type TinymceProps = {
  value?: string
  onChange?: (content: string) => void
  height?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  menubar?: boolean
  statusbar?: boolean
}

export default function TinymceSimple({
  value = '',
  onChange,
  height = 500,
  placeholder = 'Start writing...',
  disabled = false,
  className = '',
  menubar = true,
  statusbar = true
}: TinymceProps) {
  const editorRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Basic plugins for reliable functionality
  const plugins = [
    'advlist',
    'autolink',
    'lists',
    'link',
    'image',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'code',
    'fullscreen',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount'
  ]

  const toolbar =
    'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'

  const editorConfig = {
    apiKey: 'lhtsirzbcxie2ohkeo9aizd7q5ih3alfz8pr3nxt89nnanxd',
    height,
    menubar,
    plugins,
    toolbar,
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    placeholder,
    setup: (editor: any) => {
      editor.on('change', () => {
        const content = editor.getContent()
        onChange?.(content)

        // Update word count
        const plainText = editor.getContent({ format: 'text' })
        const words = plainText.split(/\s+/).filter((word: string) => word.length > 0).length
        setWordCount(words)
      })
    }
  }

  // Don't render until we're on the client
  if (!isClient) {
    return (
      <div
        className={`border border-gray-200 rounded-lg p-4 ${className}`}
        style={{ height: height + 'px' }}
      >
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-300 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-300 rounded w-1/2 mb-2'></div>
          <div className='h-4 bg-gray-300 rounded w-5/6'></div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card className='mb-4'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <div>
              <CardTitle className='text-lg'>TinyMCE Editor</CardTitle>
              <CardDescription>Rich text editor</CardDescription>
            </div>
            <Badge variant='outline'>{wordCount} words</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className='border border-gray-200 rounded-lg overflow-hidden'>
        <Editor ref={editorRef} value={value} disabled={disabled} init={editorConfig} />
      </div>
    </div>
  )
}
