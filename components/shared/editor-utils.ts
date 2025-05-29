import { Editor } from '@tiptap/react'

export const insertImageFromUrl = (editor: Editor, url: string) => {
  if (url) {
    editor.chain().focus().setImage({ src: url }).run()
  }
}

export const insertInlineImageFromUrl = (
  editor: Editor,
  url: string,
  alignment: 'left' | 'right' | 'center' = 'left'
) => {
  if (url) {
    let className = 'inline-image'

    if (alignment === 'left') {
      className += ' float-left'
    } else if (alignment === 'right') {
      className += ' float-right'
    } else {
      className += ' mx-auto block'
    }

    const imageHtml = `<img src="${url}" class="${className}" alt="Inline image" />`
    editor.chain().focus().insertContent(imageHtml).run()
  }
}

export const insertSmallInlineImage = (
  editor: Editor,
  url: string,
  alignment: 'left' | 'right' = 'left'
) => {
  if (url) {
    let className = 'small-inline-image'

    if (alignment === 'left') {
      className += ' float-left'
    } else {
      className += ' float-right'
    }

    const imageHtml = `<img src="${url}" class="${className}" alt="Small inline image" />`
    editor.chain().focus().insertContent(imageHtml).run()
  }
}

export const insertVideoFromUrl = (editor: Editor, url: string) => {
  if (url) {
    editor.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}

export const setLinkFromUrl = (editor: Editor, url?: string) => {
  const previousUrl = editor.getAttributes('link').href
  const finalUrl = url || window.prompt('Enter URL:', previousUrl)

  if (finalUrl === null) return

  if (finalUrl === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  // Ensure URL has protocol
  const formattedUrl = finalUrl.startsWith('http') ? finalUrl : `https://${finalUrl}`
  editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run()
}

export const insertTable = (editor: Editor, rows = 3, cols = 3) => {
  editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
}

export const formatText = (editor: Editor, format: string) => {
  switch (format) {
    case 'bold':
      editor.chain().focus().toggleBold().run()
      break
    case 'italic':
      editor.chain().focus().toggleItalic().run()
      break
    case 'underline':
      editor.chain().focus().toggleUnderline().run()
      break
    case 'strike':
      editor.chain().focus().toggleStrike().run()
      break
    case 'code':
      editor.chain().focus().toggleCode().run()
      break
    case 'subscript':
      editor.chain().focus().toggleSubscript().run()
      break
    case 'superscript':
      editor.chain().focus().toggleSuperscript().run()
      break
    case 'highlight':
      editor.chain().focus().toggleHighlight().run()
      break
    default:
      break
  }
}

export const setHeading = (editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6) => {
  editor.chain().focus().toggleHeading({ level }).run()
}

export const setAlignment = (
  editor: Editor,
  alignment: 'left' | 'center' | 'right' | 'justify'
) => {
  editor.chain().focus().setTextAlign(alignment).run()
}

export const insertList = (editor: Editor, type: 'bullet' | 'ordered') => {
  if (type === 'bullet') {
    editor.chain().focus().toggleBulletList().run()
  } else {
    editor.chain().focus().toggleOrderedList().run()
  }
}

export const insertCodeBlock = (editor: Editor, language?: string) => {
  if (language) {
    editor.chain().focus().toggleCodeBlock({ language }).run()
  } else {
    editor.chain().focus().toggleCodeBlock().run()
  }
}

export const insertBlockquote = (editor: Editor) => {
  editor.chain().focus().toggleBlockquote().run()
}

export const insertHorizontalRule = (editor: Editor) => {
  editor.chain().focus().setHorizontalRule().run()
}

export const clearFormatting = (editor: Editor) => {
  editor.chain().focus().clearNodes().unsetAllMarks().run()
}

export const getEditorStats = (editor: Editor) => {
  return {
    characters: editor.storage.characterCount.characters(),
    words: editor.storage.characterCount.words(),
    charactersWithoutSpaces: editor.storage.characterCount.characters({ mode: 'textSize' })
  }
}
