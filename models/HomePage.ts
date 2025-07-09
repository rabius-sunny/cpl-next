import mongoose, { Schema } from 'mongoose'

const homePageSchema = new Schema(
  {
    content: {
      nav: {
        logo: {
          file: String,
          fileId: String,
          thumbnail: String
        },
        cta: {
          text: String,
          link: String
        },
        items: [
          {
            title: String,
            link: String,
            childrens: [
              {
                title: String,
                link: String
              }
            ]
          }
        ]
      },
      sliders: [
        {
          backgroundImage: {
            file: String,
            fileId: String,
            thumbnail: String
          },
          title: String,
          subtitle: String,
          direction: {
            type: String,
            enum: ['vertical', 'horizontal'],
            default: 'horizontal'
          },
          images: [
            {
              file: String,
              fileId: String,
              thumbnail: String
            }
          ]
        }
      ],
      about: {
        title: String,
        description: String
      },
      stats: {
        title: String,
        backgroundImage: {
          file: String,
          fileId: String,
          thumbnail: String
        },
        stats: [
          {
            title: String,
            count: Number
          }
        ]
      },
      testimonials: {
        title: String,
        subtitle: String,
        items: [
          {
            message: String,
            name: String,
            designation: String
          }
        ]
      },
      video: String,
      footer: {
        office: {
          items: [String]
        },
        factory: {
          items: [String]
        },
        social: [
          {
            icon: String,
            link: String
          }
        ],
        copyright: String
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
const homepage = mongoose.models.homepage || mongoose.model('homepage', homePageSchema)

export default homepage
