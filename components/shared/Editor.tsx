'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight } from 'lowlight'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  MoreHorizontal,
  Palette,
  Quote,
  Redo,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Type,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
  Youtube as YoutubeIcon
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import ImageResize from 'tiptap-extension-resize-image'
import {
  getEditorStats,
  insertImageFromUrl,
  insertTable,
  insertVideoFromUrl,
  setLinkFromUrl
} from './editor-utils'
import './editor.css'

const lowlight = createLowlight()
lowlight.register({ javascript, typescript, css, html, python, json })

type TProps = {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
}

export default function Editor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  className = ''
}: TProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      ImageResize,
      Underline,
      TextStyle,
      Color.configure({
        types: ['textStyle']
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight
      }),
      Typography,
      Placeholder.configure({
        placeholder
      }),
      CharacterCount,
      Youtube.configure({
        controls: false,
        nocookie: true
      })
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    onCreate: () => {
      setIsLoading(false)
    }
  })

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowColorPicker(false)
    }

    if (showColorPicker) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showColorPicker])

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url && editor) {
      insertImageFromUrl(editor, url)
    }
  }, [editor])

  const addYoutubeVideo = useCallback(() => {
    const url = window.prompt('Enter YouTube URL:')
    if (url && editor) {
      insertVideoFromUrl(editor, url)
    }
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    setLinkFromUrl(editor)
  }, [editor])

  const addTable = useCallback(() => {
    if (!editor) return
    insertTable(editor)
  }, [editor])

  const insertHorizontalRule = useCallback(() => {
    if (!editor) return
    editor.chain().focus().setHorizontalRule().run()
  }, [editor])

  if (!editor) {
    return (
      <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className='border-b border-gray-200 p-2 bg-gray-50'>
          <div className='flex flex-wrap items-center gap-1'>
            <div className='animate-pulse flex space-x-2'>
              <div className='w-8 h-8 bg-gray-300 rounded'></div>
              <div className='w-8 h-8 bg-gray-300 rounded'></div>
              <div className='w-8 h-8 bg-gray-300 rounded'></div>
              <div className='w-8 h-8 bg-gray-300 rounded'></div>
            </div>
          </div>
        </div>
        <div className='p-4 min-h-[300px]'>
          <div className='animate-pulse'>
            <div className='h-4 bg-gray-300 rounded w-3/4 mb-4'></div>
            <div className='h-4 bg-gray-300 rounded w-1/2 mb-4'></div>
            <div className='h-4 bg-gray-300 rounded w-5/6'></div>
          </div>
        </div>
        <div className='border-t border-gray-200 p-2 bg-gray-50'>
          <div className='animate-pulse h-4 bg-gray-300 rounded w-32'></div>
        </div>
      </div>
    )
  }

  const colors = [
    '#000000',
    '#374151',
    '#6B7280',
    '#9CA3AF',
    '#D1D5DB',
    '#EF4444',
    '#F97316',
    '#EAB308',
    '#22C55E',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#F43F5E',
    '#06B6D4',
    '#84CC16'
  ]

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className='border-b border-gray-200 p-2 bg-gray-50'>
        <div className='flex flex-wrap items-center gap-1'>
          {/* Undo/Redo */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Text Formatting */}
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('code') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Headings */}
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Lists */}
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Alignment */}
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Special Text */}
          <Button
            variant={editor.isActive('subscript') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <SubscriptIcon className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('superscript') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <SuperscriptIcon className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('highlight') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Color Picker */}
          <div className='relative'>
            <Button variant='ghost' size='sm' onClick={() => setShowColorPicker(!showColorPicker)}>
              <Palette className='h-4 w-4' />
            </Button>
            {showColorPicker && (
              <div className='absolute top-8 left-0 z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-lg'>
                <div className='grid grid-cols-5 gap-1'>
                  {colors.map((color) => (
                    <button
                      key={color}
                      className='w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform'
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run()
                        setShowColorPicker(false)
                      }}
                    />
                  ))}
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='w-full mt-2'
                  onClick={() => {
                    editor.chain().focus().unsetColor().run()
                    setShowColorPicker(false)
                  }}
                >
                  Remove Color
                </Button>
              </div>
            )}
          </div>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Link */}
          <Button
            variant={editor.isActive('link') ? 'default' : 'ghost'}
            size='sm'
            onClick={setLink}
          >
            <LinkIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
          >
            <Unlink className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Media */}
          <Button variant='ghost' size='sm' onClick={addImage}>
            <ImageIcon className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm' onClick={addYoutubeVideo}>
            <YoutubeIcon className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Table */}
          <Button variant='ghost' size='sm' onClick={addTable}>
            <TableIcon className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Quote and Code Block */}
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className='h-4 w-4' />
          </Button>
          <Button
            variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
            size='sm'
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Type className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Horizontal Rule */}
          <Button
            variant='ghost'
            size='sm'
            onClick={insertHorizontalRule}
            title='Insert horizontal rule'
          >
            <Minus className='h-4 w-4' />
          </Button>

          {/* Clear Formatting */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title='Clear formatting'
          >
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className='relative'>
        {/* Bubble Menu */}
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center gap-1'>
            <Button
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className='h-4 w-4' />
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className='h-4 w-4' />
            </Button>
            <Button
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className='h-4 w-4' />
            </Button>
            <Button variant='ghost' size='sm' onClick={setLink}>
              <LinkIcon className='h-4 w-4' />
            </Button>
          </div>
        </BubbleMenu>

        {/* Floating Menu */}
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className='h-4 w-4' />
            </Button>
            <Button variant='ghost' size='sm' onClick={addImage}>
              <ImageIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className='h-4 w-4' />
            </Button>
          </div>
        </FloatingMenu>

        <EditorContent
          editor={editor}
          className='prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-4 min-h-[300px] focus:outline-none'
        />
      </div>

      {/* Footer with Character Count */}
      <div className='border-t border-gray-200 p-2 bg-gray-50 text-sm text-gray-500 flex justify-between items-center'>
        <div className='flex gap-4'>
          <span>{getEditorStats(editor).characters} characters</span>
          <span>{getEditorStats(editor).words} words</span>
          <span>{getEditorStats(editor).charactersWithoutSpaces} characters (no spaces)</span>
        </div>
        {editor.isActive('table') && (
          <div className='flex gap-1'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              Add Column Before
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              Add Column After
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              Delete Column
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              Add Row Before
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              Add Row After
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              Delete Row
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              Delete Table
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
