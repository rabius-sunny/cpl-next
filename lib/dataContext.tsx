'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type SiteDataContextType = {
  siteData: AllData | null | undefined
  setSiteData: (siteData: AllData | null) => void
}

const SiteDataContext = createContext<SiteDataContextType | null>(null)

export function useSiteData(): SiteDataContextType {
  const context = useContext(SiteDataContext)
  if (context === null) {
    throw new Error('useSiteData must be used within a SiteDataProvider')
  }
  return context
}

export function SiteDataProvider({
  children,
  initialData
}: {
  children: ReactNode
  initialData: AllData | null
}) {
  const [siteData, setSiteData] = useState<AllData | null>(initialData)

  useEffect(() => {
    setSiteData(initialData)
  }, [initialData])

  return (
    <SiteDataContext.Provider value={{ siteData, setSiteData }}>
      {children}
    </SiteDataContext.Provider>
  )
}
