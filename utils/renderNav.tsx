'use client'

import { adminNavItems } from '@/configs/nav-data'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

// Recursive function to render nav items with children
export const renderadminNavItems = (items: typeof adminNavItems, pathname: string) => {
  const router = useRouter()
  return items.map((item, idx) => {
    const isActive = (link: string) => pathname === link

    return (
      <div key={idx} className='mb-2'>
        <button
          onClick={() => (item.link ? router.push(item.link) : null)}
          className={cn(
            'flex items-center w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
            pathname === item.link
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            item.link === '' && 'bg-transparent hover:bg-transparent'
          )}
        >
          {item.icon}
          {item.label}
        </button>

        {item.children && (
          <div className='mt-1 ml-4 pl-2 border-l'>
            {item.children.map((child, idx) => (
              <button
                key={idx}
                onClick={() => router.push(child.link)}
                className={cn(
                  'flex items-center cursor-pointer w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-colors mt-1',
                  isActive(child.link)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {child.icon}
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  })
}
