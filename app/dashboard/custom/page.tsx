'use client'

import PageBuilder from '@/components/dashboard/page-builder/PageBuilder'

type TProps = {}

export default function CustomPageBuilder({}: TProps) {
  return (
    <div className='container mx-auto py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Page Builder Sucks 😡</h1>
        <p className='text-gray-600 mt-2'>
          Create and manage custom pages with drag-and-drop sections
        </p>
      </div>
      <PageBuilder />
    </div>
  )
}
