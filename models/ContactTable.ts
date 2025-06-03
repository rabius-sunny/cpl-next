import mongoose, { Schema } from 'mongoose'

const contactSchema = new Schema(
  {
    name: String,
    subject: String,
    message: String,
    email: String,
    phone: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create the model
const ContactTable = mongoose.models.contactTable || mongoose.model('contactTable', contactSchema)

export default ContactTable
