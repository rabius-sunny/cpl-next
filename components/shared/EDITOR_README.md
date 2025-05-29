# Tiptap Rich Text Editor Component

A comprehensive rich text editor built with Tiptap for React/Next.js applications. This editor includes all essential features for content creation with a beautiful, modern UI.

## Features

### Text Formatting

- **Bold**, _Italic_, <u>Underline</u>, ~~Strikethrough~~
- `Inline code` formatting
- Text color selection with color picker
- Highlight text with multiple colors
- Subscript and Superscript text
- Clear formatting option

### Headings & Structure

- Heading levels 1, 2, and 3
- Bullet lists and numbered lists
- Blockquotes
- Horizontal rules
- Text alignment (left, center, right, justify)

### Advanced Features

- **Tables**: Resizable tables with header rows, add/remove columns and rows
- **Links**: Add, edit, and remove hyperlinks
- **Images**: Insert images from URLs with responsive sizing
- **YouTube Videos**: Embed YouTube videos directly
- **Code Blocks**: Syntax-highlighted code blocks with multiple language support
- **Typography**: Smart typography features (quotes, dashes, etc.)

### Developer Features

- **Character Count**: Real-time character and word counting
- **Placeholder Text**: Customizable placeholder when editor is empty
- **Bubble Menu**: Context menu that appears when text is selected
- **Floating Menu**: Menu that appears on empty lines for quick formatting
- **SSR Compatible**: Properly configured for Next.js server-side rendering

## Installation

The editor comes with all necessary dependencies pre-installed:

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-* lowlight highlight.js
```

## Basic Usage

```tsx
import Editor from '@/components/shared/Editor'
import { useState } from 'react'

export function MyComponent() {
  const [content, setContent] = useState('<p>Hello world!</p>')

  return (
    <Editor
      content={content}
      onChange={setContent}
      placeholder='Start writing...'
      className='min-h-[400px]'
    />
  )
}
```

## Props

| Prop          | Type                        | Default              | Description                   |
| ------------- | --------------------------- | -------------------- | ----------------------------- |
| `content`     | `string`                    | `''`                 | Initial HTML content          |
| `onChange`    | `(content: string) => void` | `undefined`          | Callback when content changes |
| `placeholder` | `string`                    | `'Start writing...'` | Placeholder text              |
| `editable`    | `boolean`                   | `true`               | Whether editor is editable    |
| `className`   | `string`                    | `''`                 | Additional CSS classes        |

## Keyboard Shortcuts

| Shortcut               | Action        |
| ---------------------- | ------------- |
| `Ctrl/Cmd + B`         | Bold          |
| `Ctrl/Cmd + I`         | Italic        |
| `Ctrl/Cmd + U`         | Underline     |
| `Ctrl/Cmd + Shift + X` | Strikethrough |
| `Ctrl/Cmd + E`         | Code          |
| `Ctrl/Cmd + Shift + E` | Code block    |
| `Ctrl/Cmd + Alt + 1`   | Heading 1     |
| `Ctrl/Cmd + Alt + 2`   | Heading 2     |
| `Ctrl/Cmd + Alt + 3`   | Heading 3     |
| `Ctrl/Cmd + Shift + 8` | Bullet list   |
| `Ctrl/Cmd + Shift + 7` | Ordered list  |
| `Ctrl/Cmd + Shift + >` | Blockquote    |
| `Ctrl/Cmd + Z`         | Undo          |
| `Ctrl/Cmd + Y`         | Redo          |

## Toolbar Features

### Text Formatting Toolbar

- Undo/Redo buttons
- Bold, Italic, Underline, Strikethrough, Code
- Heading levels 1-3
- Lists (bullet and numbered)
- Text alignment options
- Subscript and Superscript
- Highlight and color picker

### Media & Content Toolbar

- Link management (add/remove links)
- Image insertion from URLs
- YouTube video embedding
- Table insertion and management
- Quote blocks and code blocks
- Horizontal rule insertion

## Advanced Features

### Tables

The editor supports full table functionality:

- Insert tables with customizable rows/columns
- Add/remove columns and rows
- Resizable columns
- Header row support
- Table navigation with keyboard

### Code Blocks

Syntax highlighting for multiple languages:

- JavaScript/TypeScript
- Python
- CSS
- HTML/XML
- JSON
- And more...

### Color Picker

- Pre-defined color palette
- Text color customization
- Highlight colors
- Remove color option

## Styling

The editor comes with comprehensive CSS styling in `editor.css`:

```css
/* Custom styles for Tiptap elements */
.ProseMirror {
  /* Editor content styles */
}
.ProseMirror h1,
h2,
h3 {
  /* Heading styles */
}
.ProseMirror table {
  /* Table styles */
}
/* And many more... */
```

## Utility Functions

The editor includes utility functions in `editor-utils.ts`:

```typescript
import {
  insertImageFromUrl,
  insertVideoFromUrl,
  setLinkFromUrl,
  insertTable,
  getEditorStats
} from './editor-utils'
```

## SSR Configuration

The editor is properly configured for Next.js SSR:

```typescript
const editor = useEditor({
  // ... extensions
  immediatelyRender: false, // Prevents hydration mismatches
  onCreate: () => setIsLoading(false)
})
```

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Examples

### Read-only Editor

```tsx
<Editor content={savedContent} editable={false} className='border-0' />
```

### With Character Limit

The editor automatically shows character and word count in the footer.

### Custom Styling

```tsx
<Editor
  content={content}
  onChange={setContent}
  className='min-h-[600px] border-2 border-blue-500'
/>
```

## Troubleshooting

### SSR Hydration Issues

If you encounter SSR hydration mismatches, ensure:

1. The editor has `immediatelyRender: false` set
2. You're using `'use client'` directive
3. Loading states are properly handled

### Performance

For large documents:

- Consider implementing debounced onChange handlers
- Use the character count feature to limit content size
- Implement lazy loading for images

## Contributing

To extend the editor:

1. Add new extensions to the `extensions` array
2. Update the toolbar with new buttons
3. Add corresponding utility functions
4. Update CSS styling as needed

## License

This component is part of the CPL project and follows the same licensing terms.
