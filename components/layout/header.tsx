import { retrieveHomepage } from '@/actions/data/homepage'
import Image from "next/image"
import Link from "next/link"
import AnimatedButton from '../common/AnimatedButton'
// import MobileMenu from './MobileMenu'
import dynamic from 'next/dynamic'
import ResponsiveMenu from './MultiLevelMenu'

const MobileMenu = dynamic(() => import('./MobileMenu'), {})

export default async function Header() {
  const data = await retrieveHomepage()
  const siteData = data?.data?.nav


  return (
    <header className="top-0 z-50 sticky bg-white px-4 py-2 lg:py-4 w-full">
      <div className="mx-auto lg:px-4 max-w-7xl container">
        <nav className="flex justify-between items-center">
          <Link href='/' className="basis-1/3">
            <Image src={siteData?.logo?.file || '/images/logo.png'} alt="Logo" height={20} width={140} />
          </Link>

          <div className="hidden lg:flex items-center space-x-4">
            <ResponsiveMenu items={siteData?.items || []} />

            {siteData?.cta &&
              <AnimatedButton href={siteData?.cta?.link}>
                {siteData?.cta?.text}
              </AnimatedButton>}
          </div>

          {siteData &&
            <div className="lg:hidden block">
              <MobileMenu items={siteData?.items} />
            </div>
          }
        </nav >
      </div >
    </header >
  )
}
