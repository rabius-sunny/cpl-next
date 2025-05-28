import { connectToDatabase } from '@/configs/dbConnect'
import OthersContent from '@/models/OthersContent'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDatabase()

    // Get the homepage sections data or create a new default one if it doesn't exist
    let othersContent = await OthersContent.findOne()

    if (!othersContent) {
      othersContent = await OthersContent.create({
        products: {
          rightText: '',
          leftText: '',
          items: []
        },
        services: {
          title: '',
          features: [],
          description: '',
          items: []
        },
        projects: {
          title: '',
          subtitle: '',
          items: []
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: othersContent || null
    })
  } catch (error: any) {
    console.error('Error fetching others content sections:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch others content'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const data = await request.json()

    // Find the existing document or create a new one
    let othersContent = await OthersContent.findOne()

    if (othersContent) {
      // Update the existing document
      othersContent = await OthersContent.findByIdAndUpdate(othersContent._id, {
        $set: data
      })
    } else {
      // Create a new document
      othersContent = await OthersContent.create(data)
    }

    revalidatePath('/')
    revalidateTag('others')

    return NextResponse.json(othersContent)
  } catch (error) {
    console.error('Error updating others content sections:', error)
    return NextResponse.json({ error: 'Failed to update others content sections' }, { status: 500 })
  }
}
