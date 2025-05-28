import About from '@/components/dashboard/homepage/About'
import AdminFooter from '@/components/dashboard/homepage/Footer'
import Nav from '@/components/dashboard/homepage/Nav'
import Sliders from '@/components/dashboard/homepage/Sliders'
import Stats from '@/components/dashboard/homepage/Stats'
import Testimonials from '@/components/dashboard/homepage/Testimonials'
import Video from '@/components/dashboard/homepage/Video'

type TResponse = {
  success: boolean
  data: HomePageContent
}

export default async function Homepage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/get-data`, {
    next: { tags: ['homepage'] }
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const data: TResponse = await res.json()

  if (!data.success) {
    throw new Error('Failed to fetch data')
  }
  return (
    <div className='grid gap-8'>
      <Nav data={data.data.nav} />
      <div className='h-1 bg-secondary w-full my-4' />
      <Sliders data={data.data.sliders} />
      <div className='h-1 bg-secondary w-full my-4' />
      <About data={data.data.about} />
      <div className='h-1 bg-secondary w-full my-4' />
      <Stats data={data.data.stats} />
      <div className='h-1 bg-secondary w-full my-4' />
      <Testimonials data={data.data.testimonials} />
      <div className='h-1 bg-secondary w-full my-4' />
      <Video data={data.data.video} />
      <div className='h-1 bg-secondary w-full my-4' />
      <AdminFooter data={data.data.footer} />
    </div>
  )
}
