# Page Builder System

A comprehensive page builder system with refactored architecture for better separation of concerns and maintainability.

## Architecture

### Main Component

- **PageBuilder.tsx** - Main container component that orchestrates all page builder functionality

### UI Components (`/components`)

- **PageBuilderHeader.tsx** - Header with create page button and dialog trigger
- **PageDialogs.tsx** - Create and edit page dialogs
- **PageEditor.tsx** - Main page editing interface with sections management
- **PageList.tsx** - Sidebar component showing all pages with delete functionality
- **SectionButtons.tsx** - Sidebar component with buttons to add different section types

### Custom Hooks (`/hooks`)

- **usePages.ts** - Manages pages list, CRUD operations, and publishing
- **useCurrentPage.ts** - Manages current page state, sections, and section operations

### Section Editors

- **HeaderBannerEditor.tsx** - Editor for header banner sections
- **ContentSectionEditor.tsx** - Editor for content sections
- **GridLayoutEditor.tsx** - Editor for grid layout sections
- **ImageTextEditor.tsx** - Editor for image and text sections
- **BottomMediaEditor.tsx** - Editor for bottom media sections

## Features

### Page Management

- ✅ Create new pages with title and slug
- ✅ Edit page metadata (title/slug)
- ✅ Delete pages with confirmation
- ✅ Publish/unpublish pages
- ✅ Preview published pages
- ✅ Auto page selection after creation

### Section Management

- ✅ Add multiple section types
- ✅ Reorder sections (move up/down)
- ✅ Edit section content inline
- ✅ Delete sections
- ✅ Real-time section updates

### UI/UX

- ✅ Responsive design with sidebar and main content area
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Card-based layout with modern styling
- ✅ Status badges for published/draft pages

### Technical Features

- ✅ Server-side caching with revalidation
- ✅ TypeScript throughout for type safety
- ✅ Custom hooks for data management
- ✅ Separated concerns with component isolation
- ✅ Optimistic UI updates

## Usage

```tsx
import { PageBuilder } from '@/components/dashboard/page-builder'

export default function CustomPagesPage() {
  return <PageBuilder />
}
```

## Data Flow

1. **usePages** hook handles:

   - Loading pages list
   - Creating new pages
   - Updating page metadata
   - Publishing/unpublishing
   - Deleting pages

2. **useCurrentPage** hook handles:

   - Loading individual page details
   - Managing sections array
   - Section CRUD operations
   - Saving page sections
   - Section reordering

3. **PageBuilder** component orchestrates:
   - Dialog state management
   - Connecting hooks to UI components
   - Event handling and coordination

## Component Props

### PageList

- `pages` - Array of pages
- `currentPage` - Currently selected page
- `loading` - Loading state
- `onPageSelect` - Page selection handler
- `onDeletePage` - Page deletion handler

### PageEditor

- `currentPage` - Current page object
- `sections` - Array of sections
- `saving` - Save state
- `savePage` - Save handler
- `togglePagePublish` - Publish toggle handler
- `openPagePreview` - Preview handler
- `openEditDialog` - Edit dialog handler
- Section management handlers

### SectionButtons

- `onAddSection` - Section addition handler

## Future Enhancements

- [ ] Drag and drop section reordering
- [ ] Section templates/presets
- [ ] Undo/redo functionality
- [ ] Version history
- [ ] Collaborative editing
- [ ] Advanced SEO settings
- [ ] Custom CSS per page
- [ ] Import/export pages
