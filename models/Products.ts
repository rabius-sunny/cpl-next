import { generateSlug } from '@/lib/utils'
import mongoose, { Schema } from 'mongoose'

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'title' },
    description: String,
    features: [
      {
        key: String,
        value: String
      }
    ],
    thumbnail: {
      file: String,
      fileId: String,
      thumbnail: String
    },
    images: [
      {
        file: String,
        fileId: String,
        thumbnail: String
      }
    ]
  },
  {
    timestamps: true,
    // This ensures virtuals are included when converting document to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

productsSchema.pre('save', function (next) {
  this.slug = generateSlug(this.name)
  next()
})

productsSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as { name?: string }
  if (update.name) {
    this.setUpdate({ ...update, slug: generateSlug(update.name) })
  }
  next()
})
// productsSchema.plugin(URLSlug('name', { field: 'Slug' }))

const products = mongoose.models.products || mongoose.model('products', productsSchema)

export default products
