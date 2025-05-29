'use client'

import { useState } from 'react'

export interface DragData {
  type: 'section'
  sectionType: PageSection['type']
  source: 'palette' | 'editor'
  sectionId?: string
  index?: number
}

export function useDragAndDrop() {
  const [dragData, setDragData] = useState<DragData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState<string | null>(null)

  const startDrag = (data: DragData) => {
    setDragData(data)
    setIsDragging(true)
  }

  const endDrag = () => {
    setDragData(null)
    setIsDragging(false)
    setDropZoneActive(null)
  }

  const setActiveDropZone = (zoneId: string | null) => {
    setDropZoneActive(zoneId)
  }

  return {
    dragData,
    isDragging,
    dropZoneActive,
    startDrag,
    endDrag,
    setActiveDropZone
  }
}
