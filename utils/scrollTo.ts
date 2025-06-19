'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const useScrollToHash = (offset = 150) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const id = hash.replace('#', '')

    // Retry scroll in case element is rendered late
    const scrollToElement = () => {
      const el = document.getElementById(id)
      if (!el) return

      const y = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }

    const timeout = setTimeout(scrollToElement, 100)
    return () => clearTimeout(timeout)
  }, [pathname, searchParams])
}
