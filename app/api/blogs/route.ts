import { connectToDatabase } from '@/configs/dbConnect'
import Blog from '@/models/Blog'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const published = searchParams.get('published')

    // Create filter for query
    const filter: any = {}

    // If published parameter exists, filter by it
    if (published !== null) {
      filter.published = published === 'true'
    }

    // Connect to the database
    await connectToDatabase()

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch blogs
    const blogs = await Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    // Get total count for pagination
    const total = await Blog.countDocuments(filter)

    // Return blogs with pagination info
    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    })
  } catch (error: any) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}
