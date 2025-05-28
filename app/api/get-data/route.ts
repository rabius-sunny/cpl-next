import { connectToDatabase } from '@/configs/dbConnect'
import HomePage from '@/models/HomePage'
import { NextResponse } from 'next/server'

/**
 * GET API endpoint to retrieve homepage content
 */
export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase()

    // Find existing content
    let content = await HomePage.findOne()

    if (!content) {
      content = await HomePage.create({
        content: {
          nav: {
            logo: {
              file: '',
              fileId: '',
              thumbnail: ''
            },
            cta: {
              text: '',
              link: ''
            },
            items: [
              {
                title: '',
                link: '',
                childrens: [
                  {
                    title: '',
                    link: ''
                  }
                ]
              }
            ]
          },
          sliders: [
            {
              backgroundImage: {
                file: '',
                fileId: '',
                thumbnail: ''
              },
              title: '',
              subtitle: '',
              images: [
                {
                  file: '',
                  fileId: '',
                  thumbnail: ''
                }
              ]
            }
          ],
          about: {
            title: '',
            description: ''
          },
          stats: {
            title: '',
            backgroundImage: {
              file: '',
              fileId: '',
              thumbnail: ''
            },
            stats: [
              {
                title: '',
                count: 0
              }
            ]
          },
          testimonials: {
            title: '',
            subtitle: '',
            items: [
              {
                message: '',
                name: '',
                designation: ''
              }
            ]
          },
          video: {
            file: '',
            fileId: '',
            thumbnail: ''
          },
          footer: {
            office: {
              items: ['']
            },
            factory: {
              items: ['']
            },
            social: [
              {
                icon: '',
                link: ''
              }
            ],
            copyright: ''
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: content?.content || null
    })
  } catch (error: any) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch homepage content'
      },
      { status: 500 }
    )
  }
}
