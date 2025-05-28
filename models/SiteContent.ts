import mongoose, { Schema } from 'mongoose'

// Define the Site Content schema
const siteContentSchema = new Schema(
  {
    content: {
      // Logo
      logo: {
        thumbnail: String,
        file: String,
        fileId: String
      },
      // Banners section
      banners: [
        {
          title: String,
          subTitle: String,
          description: String,
          image: {
            thumbnail: String,
            file: String,
            fileId: String
          },
          product: {
            description: String,
            features: [
              {
                key: String,
                value: String
              }
            ],
            images: [
              {
                thumbnail: String,
                file: String,
                fileId: String
              }
            ]
          }
        }
      ],
      // About section
      about: {
        title: String,
        subtitle: String,
        description: String,
        images: [
          {
            thumbnail: String,
            file: String,
            fileId: String
          }
        ],
        stats: [
          {
            title: String,
            count: Number
          }
        ],
        teamfirst: [
          {
            name: String,
            designation: String,
            image: {
              thumbnail: String,
              file: String,
              fileId: String
            }
          }
        ],
        teamsecond: [
          {
            name: String,
            designation: String,
            image: {
              thumbnail: String,
              file: String,
              fileId: String
            }
          }
        ]
      },
      // Clients section
      clients: {
        title: String,
        subtitle: String,
        logos: [
          {
            image: {
              thumbnail: String,
              file: String,
              fileId: String
            },
            link: String
          }
        ]
      },
      // Contact section
      contact: {
        title: String,
        subtitle: String,
        banner: {
          thumbnail: String,
          file: String,
          fileId: String
        }
      },
      // Footer section
      footer: {
        aboutText: String,
        getInTouch: [
          {
            key: String,
            value: String
          }
        ],
        socialMoto: String,
        socialLinks: [
          {
            icon: String,
            link: String
          }
        ]
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create the model
const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema)

export default SiteContent

/**
//  * Slider > title, subtitle, description, banner image
//  * Product > rightText, leftTex, items> image, title, description
//  * About > previous about section, stats>title, count
//  * services > title, features>array of strings, description, items> image, title, description
//  * projects> title, subtitle, items: image, title,subtitle, description
//  * contact> banner image, title, subtitle
//  * footer> aboutus text, getintouch> key,value, socialmedia> title, link>icon,link
 */
