import BookingsTable from '@/components/dashboard/BookingsTable'

export default async function Bookings() {
  const bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API}/get-bookings`, {
    next: { tags: ['bookings'], revalidate: 120 }
  })
  if (!bookingsRes.ok) {
    return <div>No data available</div>
  }
  const bookings = await bookingsRes.json()

  return (
    <div>
      <BookingsTable bookings={bookings?.data || []} />
    </div>
  )
}
