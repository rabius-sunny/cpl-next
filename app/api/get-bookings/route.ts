import { connectToDatabase } from '@/configs/dbConnect'
import ContactTable from '@/models/ContactTable'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase()

    // Find existing content
    let content = await ContactTable.find()

    return NextResponse.json({
      success: true,
      data: content || null
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch homepage content'
      },
      { status: 500 }
    )
  }
}
