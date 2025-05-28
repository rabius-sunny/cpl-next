'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { renderadminNavItems } from '@/utils/renderNav'
import { AlignLeft } from 'lucide-react'

type TProps = {
  logo: string
  pathname: string
  items: any[]
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export default function NavSheet({ logo, items, side = 'left', pathname }: TProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline'>
          <AlignLeft />
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{logo}</SheetTitle>
        </SheetHeader>
        <div className='flex-1 py-5 overflow-y-auto'>
          <nav className='space-y-1 px-3'>{renderadminNavItems(items, pathname)}</nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
