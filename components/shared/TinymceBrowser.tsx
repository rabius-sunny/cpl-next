'use client'

import { useEffect, useState } from 'react'

// Client-side only TinyMCE wrapper to avoid SSR issues
export default function TinymceBrowser({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything on the server
  if (!isMounted) {
    return (
      <div className='border border-gray-200 rounded-lg overflow-hidden'>
        <div className='animate-pulse'>
          <div className='bg-gray-200 h-12 rounded-t-lg'></div>
          <div className='bg-gray-100 p-4' style={{ height: '500px' }}>
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

  return <>{children}</>
}
