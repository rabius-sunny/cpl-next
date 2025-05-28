import About from '@/components/dashboard/homepage/About'
import Nav from '@/components/dashboard/homepage/Nav'
import Sliders from '@/components/dashboard/homepage/Sliders'

type TResponse = {
  success: boolean
  data: HomePageContent
}

export default async function LogoPage() {
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
    </div>
  )
}
