import mongoose, { Schema } from 'mongoose'

const productsSchema = new Schema(
  {
    products: [
      {
        name: String,
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

const products = mongoose.models.products || mongoose.model('products', productsSchema)

export default products
