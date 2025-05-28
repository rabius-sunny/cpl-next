'use client'
import { SheetHeader } from '@/components/ui/sheet'
import { siteConfig } from "@/configs/nav-data"
import { useSiteData } from '@/lib/dataContext'
import { cn } from "@/lib/utils"
import { scrollToElement } from '@/utils/scrollTo'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { DialogTitle } from '../ui/dialog'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTrigger } from "../ui/sheet"

export default function Header() {
  const [currentHash, setCurrentHash] = useState('')

  useEffect(() => {
    if (window) {
      const id = window.location.hash?.substring(1) || ''
      setCurrentHash(id)
      scrollToElement(id)
    }
  }, [])

  const { siteData } = useSiteData()

  return (
    <header className="top-0 z-20 sticky bg-white px-4 w-full">
      <div className="mx-auto lg:px-4 container">
        <nav className="relative flex justify-between items-center">

          <Link href='/' className="h-auto">
            <div className="flex justify-start items-start py-2">
              <Image src={siteData?.logo?.file || '/images/logo.png'} alt="Logo" height={65} width={130} className='ml-0 h- object-cover' />
            </div>
          </Link>

          <div className="hidden lg:flex space-x-4">
            {siteConfig?.mainNav?.map((item) =>
              <button
                key={item?.title}
                className={cn(
                  "block px-3 py-2.5 text-gray-800 hover:text-secondary cursor-pointer",
                  { "text-secondary": currentHash === item?.title }
                )}
                onClick={() => {
                  scrollToElement(item.title?.replaceAll(' ', '_').toLowerCase())
                  setCurrentHash(item.title)
                }}
              >
                {item?.title}
              </button>
            )}
          </div>

          <div className="lg:hidden block">
            <Sheet>
              <SheetTrigger>
                <span className="group lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 border border-transparent rounded-md focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 font-medium text-white text-sm cursor-pointer">
                  <span className="bg-gray-800 w-6 h-[3px]" />
                  <span className="bg-gray-800 -mr-5 group-hover:-mr-0 w-6 h-[3px] transition-all duration-300 ease-in-out transform" />
                  <span className="bg-gray-800 w-6 h-[3px]" />
                </span>
              </SheetTrigger>
              <SheetContent className="bg-primary !border-none w-[85%] max-w-sm">
                <SheetHeader>
                  <DialogTitle className='hidden'>Menu</DialogTitle>
                  <SheetClose className={cn("absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background !bg-primary !z-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent")}>
                    <span className="group lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-md focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 font-medium text-white text-sm cursor-pointer">
                      <span className="bg-white w-6 h-[3px]" />
                      <span className="bg-white -ml-5 group-hover:-ml-0 w-6 h-[3px] transition-all duration-300 ease-in-out transform" />
                      <span className="bg-white w-6 h-[3px]" />
                    </span>
                  </SheetClose>
                </SheetHeader>


                <SheetDescription asChild>
                  <div className="flex flex-col justify-center space-x-4 pb-20 overflow-y-auto text-center">
                    {siteConfig?.mainNav?.map((item) =>
                      <button
                        key={item?.title}
                        className="block px-3 py-3.5 text-white hover:text-gray-50 cursor-pointer"
                        onClick={() => {
                          scrollToElement(item.title?.replaceAll(' ', '_').toLowerCase())
                          setCurrentHash(item.title)
                        }}
                      >
                        {item?.title}
                      </button>
                    )}
                  </div>
                </SheetDescription>
              </SheetContent>
            </Sheet>
          </div>
        </nav >
      </div >
    </header >
  )
}
