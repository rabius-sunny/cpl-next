'use server'

import { ContactFormValues } from '@/components/common/contact-form'
import { connectToDatabase } from '@/configs/dbConnect'
import ContactTable from '@/models/ContactTable'
import { revalidateTag } from 'next/cache'

export async function createContactData(data: ContactFormValues) {
  try {
    await connectToDatabase()

    await ContactTable.create(data)

    revalidateTag('contacts')

    return { success: true }
  } catch {
    return { success: false }
  }
}
