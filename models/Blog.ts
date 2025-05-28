import mongoose, { Schema } from 'mongoose'

// Define the Blog schema
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [100, 'Title cannot be more than 100 characters']
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxLength: [300, 'Short description cannot be more than 300 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    image: {
      thumbnail: String,
      file: String,
      fileId: String
    },
    published: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    // This ensures virtuals are included when converting document to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create and export the model
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

export default Blog
