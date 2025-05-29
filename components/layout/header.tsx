import { retrieveHomepage } from '@/actions/data/homepage'
import { SheetHeader } from '@/components/ui/sheet'
import Image from "next/image"
import Link from "next/link"
import AnimatedButton from '../common/AnimatedButton'
import { DialogTitle } from '../ui/dialog'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTrigger } from "../ui/sheet"
import ResponsiveMenu, { MobileMenuItem } from './MultiLevelMenu'

export default async function Header() {
  const data = await retrieveHomepage()
  const siteData = data?.data?.nav

  console.log('siteData :>> ', siteData);
  return (
    <header className="top-0 z-50 sticky bg-white px-4 py-2 lg:py-4 w-full">
      <div className="mx-auto lg:px-4 max-w-7xl container">
        <nav className="flex justify-between items-center">
          <Link href='/' className="basis-1/3">
            <Image src={siteData?.logo?.file || '/images/logo.png'} alt="Logo" height={50} width={300} layout="responsive" />
          </Link>

          <div className="hidden lg:flex items-center space-x-4">
            <ResponsiveMenu items={siteData?.items || []} />

            {siteData?.cta &&
              <AnimatedButton href={siteData?.cta?.link}>
                {siteData?.cta?.text}
              </AnimatedButton>}
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
              <SheetContent className="bg-white !border-none w-[85%] max-w-sm">
                <SheetHeader>
                  <DialogTitle className=''>Menu</DialogTitle>
                  <SheetClose />
                </SheetHeader>


                <SheetDescription asChild>
                  <div className="relative pb-20 max-w-full overflow-y-auto">
                    {siteData?.items?.map((item, index) => (
                      <MobileMenuItem key={index} item={item} />
                    ))}
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
