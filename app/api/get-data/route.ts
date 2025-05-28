import { connectToDatabase } from '@/configs/dbConnect'
import SiteContent from '@/models/SiteContent'
import { NextResponse } from 'next/server'

/**
 * GET API endpoint to retrieve homepage content
 */
export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase()

    // Find existing content
    let content = await SiteContent.findOne()

    if (!content) {
      content = await SiteContent.create({
        content: {
          // Logo
          logo: {
            thumbnail: '',
            file: '',
            fileId: ''
          },
          // Banners section
          banners: [
            {
              title: '',
              subTitle: '',
              description: '',
              image: {
                thumbnail: '',
                file: '',
                fileId: ''
              },
              product: {
                description: '',
                features: [
                  {
                    key: '',
                    value: ''
                  }
                ],
                images: [
                  {
                    thumbnail: '',
                    file: '',
                    fileId: ''
                  }
                ]
              }
            }
          ],
          // About section
          about: {
            title: '',
            subtitle: '',
            description: '',
            images: [
              {
                thumbnail: '',
                file: '',
                fileId: ''
              }
            ],
            stats: [
              {
                title: '',
                count: 2
              }
            ],
            teamfirst: [
              {
                name: '',
                designation: '',
                image: {
                  thumbnail: '',
                  file: '',
                  fileId: ''
                }
              }
            ],
            teamsecond: [
              {
                name: '',
                designation: '',
                image: {
                  thumbnail: '',
                  file: '',
                  fileId: ''
                }
              }
            ]
          },
          // Clients section
          clients: {
            title: '',
            subtitle: '',
            logos: [
              {
                image: {
                  thumbnail: '',
                  file: '',
                  fileId: ''
                },
                link: ''
              }
            ]
          },
          // Contact section
          contact: {
            title: '',
            subtitle: '',
            banner: {
              thumbnail: '',
              file: '',
              fileId: ''
            }
          },
          // Footer section
          footer: {
            aboutText: '',
            getInTouch: [
              {
                key: '',
                value: ''
              }
            ],
            socialMoto: '',
            socialLinks: [
              {
                icon: '',
                link: ''
              }
            ]
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
