import { connectToDatabase } from '@/configs/dbConnect'
import ContactTable from '@/models/ContactTable'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  try {
    // Get bookingsId from the request
    const { searchParams } = new URL(req.url)
    const bookingsId = searchParams.get('id')

    if (!bookingsId) {
      return NextResponse.json(
        {
          success: false,
          error: 'bookings ID is required'
        },
        { status: 400 }
      )
    }

    // Connect to the database
    await connectToDatabase()

    // Delete the bookings
    const result = await ContactTable.findByIdAndDelete(bookingsId)

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'bookings not found'
        },
        { status: 404 }
      )
    }

    revalidateTag('bookings')

    return NextResponse.json({
      success: true,
      bookings: 'bookings deleted successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.bookings || 'Failed to delete bookings'
      },
      { status: 500 }
    )
  }
}
