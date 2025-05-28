import mongoose, { Schema } from 'mongoose'

const aboutusSchema = new Schema(
  {
    title: String,
    backgroundImage: {
      file: String,
      fileId: String,
      thumbnail: String
    },

    history: {
      title: String,
      description: String,
      image: {
        file: String,
        fileId: String,
        thumbnail: String
      }
    },
    mission: {
      title: String,
      description: String,
      image: {
        file: String,
        fileId: String,
        thumbnail: String
      }
    },
    leadership: {
      title: String,
      description: String,
      leaders: [
        {
          name: String,
          designation: String,
          bio: String
        }
      ]
    },
    bottomImage: {
      file: String,
      fileId: String,
      thumbnail: String
    }
  },
  {
    timestamps: true,
    // This ensures virtuals are included when converting document to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

const aboutus = mongoose.models.aboutus || mongoose.model('aboutus', aboutusSchema)

export default aboutus
