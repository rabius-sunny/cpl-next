import mongoose, { Schema } from 'mongoose'

const pagesSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sections: [
      {
        id: { type: String, required: true },
        type: {
          type: String,
          required: true,
          enum: ['header-banner', 'content-section', 'grid-layout', 'image-text', 'bottom-media']
        },
        order: { type: Number, required: true },
        data: { type: Schema.Types.Mixed }
      }
    ],
    isPublished: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    // This ensures virtuals are included when converting document to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

const pages = mongoose.models.pages || mongoose.model('pages', pagesSchema)

export default pages
