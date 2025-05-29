'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DragData } from '../hooks/useDragAndDrop'

interface DropZoneProps {
  onDrop: (sectionType: PageSection['type'], position: number) => void
  position: number
  isVisible?: boolean
}

export default function DropZone({ onDrop, position, isVisible = false }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    try {
      const data = e.dataTransfer.getData('application/json')
      const dragData: DragData = JSON.parse(data)

      if (dragData.type === 'section' && dragData.source === 'palette') {
        onDrop(dragData.sectionType, position)
      }
    } catch (error) {
      console.error('Error parsing drop data:', error)
    }
  }

  if (!isVisible && !isDragOver) {
    return (
      <div
        className='h-2 transition-all duration-200 hover:h-8 group'
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className='h-full rounded border-2 border-dashed border-transparent group-hover:border-primary/30 transition-colors duration-200' />
      </div>
    )
  }

  return (
    <div
      className={`transition-all duration-200 ${
        isDragOver
          ? 'h-16 border-primary bg-primary/5'
          : isVisible
            ? 'h-12 border-primary/30'
            : 'h-8 border-muted-foreground/20'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className='h-full rounded-lg border-2 border-dashed flex items-center justify-center'>
        {isDragOver ? (
          <div className='flex items-center gap-2 text-primary text-sm font-medium'>
            <Plus className='h-4 w-4' />
            Drop section here
          </div>
        ) : isVisible ? (
          <div className='flex items-center gap-2 text-muted-foreground text-xs'>
            <Plus className='h-3 w-3' />
            Drop zone
          </div>
        ) : null}
      </div>
    </div>
  )
}
