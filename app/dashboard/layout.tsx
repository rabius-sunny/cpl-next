'use client'

import NavSheet from '@/components/shared/nav-sheet'
import { adminNavItems } from '@/configs/nav-data'
import { renderadminNavItems } from '@/utils/renderNav'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const MobileNav = () => {
    return (
      <div className='lg:hidden flex items-center shadow-lg p-2 pb-3 w-full'>
        <NavSheet logo='Creative Papers Admin' items={adminNavItems} pathname={pathname} />
        <p className='ml-3 font-semibold text-lg'>Admin Dashboard</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      {/* Mobile Slide Sheet */}
      <MobileNav />
      <div className='flex'>
        {/* Desktop Sidebar */}
        <aside className='hidden z-10 fixed inset-y-0 lg:flex flex-col bg-background border-r w-64'>
          <div className='px-6 py-5 border-b'>
            <Link href='/' className='flex items-center font-bold text-lg'>
              Creative Papers
            </Link>
          </div>
          <div className='flex-1 py-5 overflow-y-auto'>
            <nav className='space-y-1 px-3'>{renderadminNavItems(adminNavItems, pathname)}</nav>
          </div>
          <div className='px-6 py-4 border-t'>
            <div className='text-muted-foreground text-xs'>
              &copy; {new Date().getFullYear()} Creative Papers Admin
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 lg:pl-64'>
          <div className='mx-auto px-4 py-6 container'>{children}</div>
        </main>
      </div>
    </div>
  )
}
