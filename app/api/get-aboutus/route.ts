import { connectToDatabase } from '@/configs/dbConnect'
import Aboutus from '@/models/Aboutus'
import { NextResponse } from 'next/server'

/**
 * GET API endpoint to retrieve About Us content
 */
export async function GET() {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()

    if (!aboutus) {
      // Return default structure if no data exists
      return NextResponse.json({
        success: true,
        data: {
          title: '',
          backgroundImage: { file: '', fileId: '', thumbnail: '' },
          history: {
            title: '',
            description: '',
            image: { file: '', fileId: '', thumbnail: '' }
          },
          mission: {
            title: '',
            description: '',
            image: { file: '', fileId: '', thumbnail: '' }
          },
          leadership: {
            title: '',
            description: '',
            leaders: []
          },
          bottomImage: { file: '', fileId: '', thumbnail: '' }
        }
      })
    }

    // Clean the data to avoid circular references
    const cleanedData = JSON.parse(JSON.stringify(aboutus))

    return NextResponse.json({
      success: true,
      data: cleanedData
    })
  } catch (error: any) {
    console.error('Error fetching About Us data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch About Us data'
      },
      { status: 500 }
    )
  }
}
