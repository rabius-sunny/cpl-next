'use server'

import { ContactFormValues } from '@/components/common/contact-form'
import { connectToDatabase } from '@/configs/dbConnect'
import ContactTable from '@/models/ContactTable'
import OthersContent from '@/models/OthersContent'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function getOthersContent() {
  try {
    await connectToDatabase()

    // Find othersContentSection data or create if not exists
    let othersContent = await OthersContent.findOne()

    if (!othersContent) {
      othersContent = await OthersContent.create({
        products: {
          rightText: '',
          leftText: '',
          items: []
        },
        services: {
          title: '',
          features: [],
          description: '',
          items: []
        },
        projects: {
          title: '',
          subtitle: '',
          items: []
        }
      })
    }
    return JSON.parse(JSON.stringify(othersContent))
  } catch (error) {
    console.error('Error fetching others content data:', error)
    return null
  }
}

export async function updateOthersContent(data: Partial<OthersContent>) {
  try {
    await connectToDatabase()

    // Find existing document or create a new one
    const othersContentSection = await OthersContent.findOne()

    if (othersContentSection) {
      // Update the existing document
      await OthersContent.findByIdAndUpdate(othersContentSection._id, {
        $set: data
      })
    } else {
      // Create a new document
      await OthersContent.create(data)
    }

    revalidatePath('/')
    revalidateTag('others')

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function createContactData(data: ContactFormValues) {
  try {
    await connectToDatabase()

    await ContactTable.create(data)

    revalidateTag('bookings')

    return { success: true }
  } catch {
    return { success: false }
  }
}
