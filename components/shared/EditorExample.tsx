'use client'

import Editor from '@/components/shared/Editor'
import { useState } from 'react'

export default function EditorExample() {
  const [content, setContent] = useState(
    '<p>Welcome to the Tiptap editor! Try out all the features:</p><ul><li>Bold, italic, underline text</li><li>Headings and lists</li><li>Tables and images</li><li>Code blocks with syntax highlighting</li><li>Links and embeds</li></ul>'
  )

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Tiptap Rich Text Editor</h1>

      <div className='space-y-6'>
        <Editor
          content={content}
          onChange={setContent}
          placeholder='Start writing your amazing content...'
          className='min-h-[400px]'
        />

        <div className='mt-8'>
          <h2 className='text-xl font-semibold mb-4'>Editor Output (HTML):</h2>
          <pre className='bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-64'>{content}</pre>
        </div>
      </div>
    </div>
  )
}
