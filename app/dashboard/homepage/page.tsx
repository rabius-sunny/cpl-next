import Nav from '@/components/dashboard/homepage/Nav'

export default async function LogoPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/get-data`, {
    next: { tags: ['homepage'] }
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await res.json()

  if (!data.success) {
    throw new Error('Failed to fetch data')
  }
  return (
    <div className='grid gap-8'>
      <Nav data={data.data.nav} />
    </div>
  )
}
