'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Editor } from '@tinymce/tinymce-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

// Dynamically import to avoid SSR issues
const TinymceBrowser = dynamic(() => import('./TinymceBrowser'), {
  ssr: false
})

type TProps = {
  value?: string
  onChange?: (content: string) => void
  height?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  toolbarMode?: 'floating' | 'sliding' | 'scrolling' | 'wrap'
  menubar?: boolean
  statusbar?: boolean
  onInit?: () => void
  onFocus?: () => void
  onBlur?: () => void
}

export default function Tinymce({
  value = '',
  onChange,
  height = 500,
  placeholder = 'Start writing...',
  disabled = false,
  className = '',
  toolbarMode = 'wrap',
  menubar = true,
  statusbar = true,
  onInit,
  onFocus,
  onBlur
}: TProps) {
  const editorRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isBrowser, setIsBrowser] = useState(false)

  // Check if we're in browser environment
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined')
  }, [])

  // Custom plugins for enhanced functionality
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
    'wordcount',
    'emoticons',
    'template',
    'codesample',
    'hr',
    'pagebreak',
    'nonbreaking',
    'toc',
    'imagetools',
    'textpattern',
    'noneditable',
    'quickbars',
    'accordion',
    'typography',
    'checklist',
    'powerpaste',
    'casechange',
    'formatpainter',
    'permanentpen',
    'mentions',
    'linkchecker',
    'tinymcespellchecker'
  ]

  // Comprehensive toolbar configuration
  const toolbar = [
    'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify',
    'outdent indent | numlist bullist checklist | forecolor backcolor removeformat | pagebreak | charmap emoticons',
    'fullscreen preview save print | insertfile image media template link anchor codesample | ltr rtl',
    'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow',
    'tableinsertcolbefore tableinsertcolafter tabledeletecol | accordion | code help'
  ]

  // TinyMCE configuration
  const editorConfig = {
    apiKey: 'lhtsirzbcxie2ohkeo9aizd7q5ih3alfz8pr3nxt89nnanxd',
    height,
    menubar,
    statusbar,
    plugins,
    toolbar_mode: toolbarMode,
    toolbar: toolbar.join(' | '),
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
        font-size: 14px;
        line-height: 1.6;
        margin: 1rem;
      }
      
      .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
        color: #888;
        content: attr(data-mce-placeholder);
        position: absolute;
      }
      
      /* Custom styles for better appearance */
      h1, h2, h3, h4, h5, h6 {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: bold;
      }
      
      h1 { font-size: 2rem; }
      h2 { font-size: 1.5rem; }
      h3 { font-size: 1.25rem; }
      
      p { margin-bottom: 1rem; }
      
      blockquote {
        border-left: 4px solid #e5e7eb;
        padding-left: 1rem;
        margin: 1rem 0;
        font-style: italic;
        color: #6b7280;
      }
      
      code {
        background-color: #f3f4f6;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-family: 'Courier New', monospace;
      }
      
      pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1rem 0;
      }
      
      table, th, td {
        border: 1px solid #e5e7eb;
      }
      
      th, td {
        padding: 0.5rem;
        text-align: left;
      }
      
      th {
        background-color: #f9fafb;
        font-weight: bold;
      }
      
      img {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
      }
      
      .checklist {
        list-style: none;
        padding-left: 0;
      }
      
      .checklist li {
        position: relative;
        padding-left: 2rem;
        margin-bottom: 0.5rem;
      }
      
      .checklist li:before {
        content: '☐';
        position: absolute;
        left: 0;
        font-size: 1.2rem;
      }
      
      .checklist li.checked:before {
        content: '☑';
        color: #10b981;
      }
    `,
    placeholder,
    browser_spellcheck: true,
    contextmenu: 'link image table',

    // Advanced features
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    quickbars_insert_toolbar: 'quickimage quicktable',
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',

    // Image handling
    images_upload_handler: (blobInfo: any, progress: any): Promise<string> =>
      new Promise((resolve, reject) => {
        // Custom image upload handler - replace with your actual upload logic
        const formData = new FormData()
        formData.append('file', blobInfo.blob(), blobInfo.filename())

        // Simulate upload
        setTimeout(() => {
          resolve('data:image/jpeg;base64,' + blobInfo.base64())
        }, 1000)
      }),

    // Template configurations
    templates: [
      {
        title: 'Article Template',
        description: 'Template for blog articles',
        content: `
          <h1>Article Title</h1>
          <p><em>By Author Name - Date</em></p>
          <h2>Introduction</h2>
          <p>Start your article here...</p>
          <h2>Main Content</h2>
          <p>Continue with your main points...</p>
          <h2>Conclusion</h2>
          <p>Wrap up your article...</p>
        `
      },
      {
        title: 'Meeting Notes',
        description: 'Template for meeting notes',
        content: `
          <h1>Meeting Notes</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Attendees:</strong> </p>
          <h2>Agenda</h2>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
          <h2>Discussion</h2>
          <p>Notes from discussion...</p>
          <h2>Action Items</h2>
          <ul class="checklist">
            <li>Action item 1</li>
            <li>Action item 2</li>
          </ul>
        `
      },
      {
        title: 'Product Description',
        description: 'Template for product descriptions',
        content: `
          <h1>Product Name</h1>
          <h2>Overview</h2>
          <p>Brief product description...</p>
          <h2>Features</h2>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
          <h2>Specifications</h2>
          <table>
            <tr><th>Property</th><th>Value</th></tr>
            <tr><td>Dimension</td><td></td></tr>
            <tr><td>Weight</td><td></td></tr>
            <tr><td>Material</td><td></td></tr>
          </table>
        `
      }
    ],

    // Table configurations
    table_default_attributes: {
      border: '1'
    },
    table_default_styles: {
      'border-collapse': 'collapse',
      width: '100%'
    },

    // Advanced text patterns
    textpattern_patterns: [
      { start: '*', end: '*', format: 'italic' },
      { start: '**', end: '**', format: 'bold' },
      { start: '#', format: 'h1' },
      { start: '##', format: 'h2' },
      { start: '###', format: 'h3' },
      { start: '1. ', cmd: 'InsertOrderedList' },
      { start: '* ', cmd: 'InsertUnorderedList' },
      { start: '- ', cmd: 'InsertUnorderedList' }
    ],

    // Initialization and event handlers
    setup: (editor: any) => {
      editor.on('init', () => {
        setIsLoading(false)
        onInit?.()
      })

      editor.on('focus', () => {
        onFocus?.()
      })

      editor.on('blur', () => {
        onBlur?.()
      })

      editor.on('input change', () => {
        const content = editor.getContent()
        const plainText = editor.getContent({ format: 'text' })
        setWordCount(plainText.split(/\s+/).filter((word: string) => word.length > 0).length)
        setCharCount(plainText.length)
        onChange?.(content)
      })

      // Custom button example
      editor.ui.registry.addButton('customInsert', {
        text: 'Custom',
        onAction: () => {
          editor.insertContent('<p><strong>Custom content inserted!</strong></p>')
        }
      })
    }
  }

  const handleEditorChange = (content: string, editor: any) => {
    onChange?.(content)
  }

  const getStats = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent({ format: 'text' })
      const words = content.split(/\s+/).filter((word: string) => word.length > 0).length
      const chars = content.length
      setWordCount(words)
      setCharCount(chars)
    }
  }

  const insertTemplate = (template: string) => {
    if (editorRef.current) {
      editorRef.current.setContent(template)
    }
  }

  const exportContent = (format: 'html' | 'text' | 'pdf') => {
    if (!editorRef.current || !isBrowser) return

    const content = editorRef.current.getContent()

    switch (format) {
      case 'html':
        const htmlBlob = new Blob([content], { type: 'text/html' })
        const htmlUrl = URL.createObjectURL(htmlBlob)
        const htmlLink = document.createElement('a')
        htmlLink.href = htmlUrl
        htmlLink.download = 'content.html'
        htmlLink.click()
        break

      case 'text':
        const textContent = editorRef.current.getContent({ format: 'text' })
        const textBlob = new Blob([textContent], { type: 'text/plain' })
        const textUrl = URL.createObjectURL(textBlob)
        const textLink = document.createElement('a')
        textLink.href = textUrl
        textLink.download = 'content.txt'
        textLink.click()
        break

      case 'pdf':
        // For PDF export, you would typically use a service or library
        console.log('PDF export would require additional setup')
        break
    }
  }

  useEffect(() => {
    getStats()
  }, [value])

  // Show loading state while waiting for browser environment
  if (!isBrowser || isLoading) {
    return (
      <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className='animate-pulse'>
          <div className='bg-gray-200 h-12 rounded-t-lg'></div>
          <div className='bg-gray-100 p-4' style={{ height: height + 'px' }}>
            <div className='space-y-3'>
              <div className='h-4 bg-gray-300 rounded w-3/4'></div>
              <div className='h-4 bg-gray-300 rounded w-1/2'></div>
              <div className='h-4 bg-gray-300 rounded w-5/6'></div>
            </div>
          </div>
          <div className='bg-gray-200 h-8 rounded-b-lg'></div>
        </div>
      </div>
    )
  }

  return (
    <TinymceBrowser>
      <div className={className}>
        {/* Quick Actions Bar */}
        <Card className='mb-4'>
          <CardHeader className='pb-3'>
            <div className='flex justify-between items-center'>
              <div>
                <CardTitle className='text-lg'>TinyMCE Rich Text Editor</CardTitle>
                <CardDescription>
                  Full-featured WYSIWYG editor with advanced capabilities
                </CardDescription>
              </div>
              <div className='flex gap-2 items-center'>
                <Badge variant='outline'>{wordCount} words</Badge>
                <Badge variant='outline'>{charCount} characters</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  insertTemplate(`
                <h1>Quick Note</h1>
                <p><em>${new Date().toLocaleDateString()}</em></p>
                <p>Start writing your note here...</p>
              `)
                }
              >
                Quick Note
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  insertTemplate(`
                <h1>Blog Post</h1>
                <p><em>By Author - ${new Date().toLocaleDateString()}</em></p>
                <h2>Introduction</h2>
                <p>Start your blog post here...</p>
              `)
                }
              >
                Blog Template
              </Button>
              <Button variant='outline' size='sm' onClick={() => exportContent('html')}>
                Export HTML
              </Button>
              <Button variant='outline' size='sm' onClick={() => exportContent('text')}>
                Export Text
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => editorRef.current?.execCommand('mceFullScreen')}
              >
                Fullscreen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Editor */}
        <div className='border border-gray-200 rounded-lg overflow-hidden'>
          <Editor
            ref={editorRef}
            value={value}
            onEditorChange={handleEditorChange}
            disabled={disabled}
            init={editorConfig}
          />
        </div>

        {/* Status Bar */}
        {statusbar && (
          <div className='mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 flex justify-between items-center'>
            <div className='flex gap-4'>
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
            </div>
            <div className='flex gap-2'>
              <Badge variant='secondary' className='text-xs'>
                TinyMCE v7.9
              </Badge>
              <Badge variant='outline' className='text-xs'>
                {disabled ? 'Read-only' : 'Editable'}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </TinymceBrowser>
  )
}
