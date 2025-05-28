import mongoose, { Schema } from 'mongoose'

// Define the Homepage Sections schema
const othersContentSchema = new Schema(
  {
    // Product section
    products: {
      title: String,
      rightText: String,
      leftText: String,
      items: [
        {
          name: String,
          icon: {
            thumbnail: String,
            file: String,
            fileId: String
          },
          thumbnail: {
            thumbnail: String,
            file: String,
            fileId: String
          },
          images: [
            {
              thumbnail: String,
              file: String,
              fileId: String
            }
          ],
          title: String,
          description: String,
          link: String
        }
      ]
    },
    // Services section
    services: {
      title: String,
      description: String,
      items: [
        {
          title: String,
          subTitle: String,
          banner: {
            thumbnail: String,
            file: String,
            fileId: String
          },
          images: [
            {
              thumbnail: String,
              file: String,
              fileId: String
            }
          ],
          description: String,
          link: String
        }
      ]
    },
    // Projects section
    projects: {
      title: String,
      subtitle: String,
      items: [
        {
          title: String,
          description: String,
          link: String,
          banner: {
            thumbnail: String,
            file: String,
            fileId: String
          },
          images: [
            {
              thumbnail: String,
              file: String,
              fileId: String
            }
          ]
        }
      ]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create the model
const OthersContent =
  mongoose.models.othersContent || mongoose.model('othersContent', othersContentSchema)

export default OthersContent
