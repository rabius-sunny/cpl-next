import mongoose, { Schema } from 'mongoose'

const contactSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    date: String,
    time: String
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
