'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import Aboutus from '@/models/Aboutus'
import { revalidatePath } from 'next/cache'

/**
 * Get About Us data
 */
export async function getAboutus() {
  try {
    await connectToDatabase()

    let aboutus = await Aboutus.findOne()

    if (!aboutus) {
      aboutus = await Aboutus.create({
        title: '',
        backgroundImage: { file: '', fileId: '', thumbnail: '' },
        sections: [],
        leadership: {
          title: '',
          description: '',
          leaders: []
        },
        bottomImage: { file: '', fileId: '', thumbnail: '' }
      })
    }

    // Clean the data to avoid circular references
    const cleanedData = JSON.parse(JSON.stringify(aboutus))

    return {
      success: true,
      data: cleanedData
    }
  } catch (error: any) {
    console.error('Error fetching About Us data:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch About Us data'
    }
  }
}

/**
 * Update About Us data
 */
export async function updateAboutus(data: Partial<Aboutus>) {
  try {
    await connectToDatabase()

    // Clean the data before saving
    const cleanedData = JSON.parse(JSON.stringify(data))

    const result = await Aboutus.findOneAndUpdate(
      {}, // Find any document (assuming only one About Us document)
      cleanedData,
      {
        new: true,
        upsert: true, // Create if doesn't exist
        runValidators: true
      }
    )

    if (!result) {
      return {
        success: false,
        error: 'Failed to update About Us data'
      }
    }

    // Revalidate the related pages
    revalidatePath('/dashboard/aboutus')
    revalidatePath('/about')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(result))
    }
  } catch (error: any) {
    console.error('Error updating About Us data:', error)
    return {
      success: false,
      error: error.message || 'Failed to update About Us data'
    }
  }
}

/**
 * Add a new leader to the leadership section
 */
export async function addLeader(leader: { name: string; designation: string; bio: string }) {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()

    if (!aboutus) {
      // Create new document with the leader
      const newAboutus = await Aboutus.create({
        leadership: {
          title: '',
          description: '',
          leaders: [leader]
        }
      })

      revalidatePath('/dashboard/aboutus')
      return {
        success: true,
        data: JSON.parse(JSON.stringify(newAboutus))
      }
    }

    // Add leader to existing document
    if (!aboutus.leadership) {
      aboutus.leadership = { title: '', description: '', leaders: [] }
    }
    if (!aboutus.leadership.leaders) {
      aboutus.leadership.leaders = []
    }

    aboutus.leadership.leaders.push(leader)
    await aboutus.save()

    revalidatePath('/dashboard/aboutus')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    console.error('Error adding leader:', error)
    return {
      success: false,
      error: error.message || 'Failed to add leader'
    }
  }
}

/**
 * Update a specific leader
 */
export async function updateLeader(
  leaderIndex: number,
  leader: { name: string; designation: string; bio: string }
) {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()

    if (!aboutus || !aboutus.leadership?.leaders || !aboutus.leadership.leaders[leaderIndex]) {
      return {
        success: false,
        error: 'Leader not found'
      }
    }

    // Update the specific leader
    aboutus.leadership.leaders[leaderIndex] = leader
    await aboutus.save()

    revalidatePath('/dashboard/aboutus')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    console.error('Error updating leader:', error)
    return {
      success: false,
      error: error.message || 'Failed to update leader'
    }
  }
}

/**
 * Delete a specific leader
 */
export async function deleteLeader(leaderIndex: number) {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()

    if (!aboutus || !aboutus.leadership?.leaders || !aboutus.leadership.leaders[leaderIndex]) {
      return {
        success: false,
        error: 'Leader not found'
      }
    }

    // Remove the leader at the specified index
    aboutus.leadership.leaders.splice(leaderIndex, 1)
    await aboutus.save()

    revalidatePath('/dashboard/aboutus')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    console.error('Error deleting leader:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete leader'
    }
  }
}

/**
 * Add a new section
 */
export async function addSection(sectionData: {
  title: string
  description: string
  image?: {
    file: string
    fileId: string
    thumbnail: string
  }
}) {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()
    if (!aboutus) {
      return {
        success: false,
        error: 'About Us data not found'
      }
    }

    if (!aboutus.sections) {
      aboutus.sections = []
    }

    aboutus.sections.push(sectionData)
    await aboutus.save()

    revalidatePath('/dashboard/about')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    console.error('Error adding section:', error)
    return {
      success: false,
      error: error.message || 'Failed to add section'
    }
  }
}

/**
 * Update a section by index
 */
export async function updateSection(
  index: number,
  sectionData: {
    title: string
    description: string
    image?: {
      file: string
      fileId: string
      thumbnail: string
    }
  }
) {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()
    if (!aboutus) {
      return {
        success: false,
        error: 'About Us data not found'
      }
    }

    if (!aboutus.sections || index < 0 || index >= aboutus.sections.length) {
      return {
        success: false,
        error: 'Section not found'
      }
    }

    aboutus.sections[index] = sectionData
    await aboutus.save()

    revalidatePath('/dashboard/about')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    console.error('Error updating section:', error)
    return {
      success: false,
      error: error.message || 'Failed to update section'
    }
  }
}

/**
 * Delete a section by index
 */
export async function deleteSection(index: number) {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()
    if (!aboutus) {
      return {
        success: false,
        error: 'About Us data not found'
      }
    }

    if (!aboutus.sections || index < 0 || index >= aboutus.sections.length) {
      return {
        success: false,
        error: 'Section not found'
      }
    }

    aboutus.sections.splice(index, 1)
    await aboutus.save()

    revalidatePath('/dashboard/about')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    console.error('Error deleting section:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete section'
    }
  }
}

/**
 * Reorder sections by moving a section from one index to another
 */
export async function reorderSections(fromIndex: number, toIndex: number) {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()
    if (!aboutus) {
      return {
        success: false,
        error: 'About Us data not found'
      }
    }

    if (
      !aboutus.sections ||
      fromIndex < 0 ||
      fromIndex >= aboutus.sections.length ||
      toIndex < 0 ||
      toIndex >= aboutus.sections.length
    ) {
      return {
        success: false,
        error: 'Invalid section indices'
      }
    }

    // Move the section
    const section = aboutus.sections.splice(fromIndex, 1)[0]
    aboutus.sections.splice(toIndex, 0, section)

    await aboutus.save()

    revalidatePath('/dashboard/about')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    console.error('Error reordering sections:', error)
    return {
      success: false,
      error: error.message || 'Failed to reorder sections'
    }
  }
}

/**
 * Update basic About Us fields (title, images, leadership title/description) without affecting sections or leaders
 */
export async function updateBasicAboutus(data: {
  title?: string
  backgroundImage?: {
    file: string
    fileId: string
    thumbnail: string
  }
  leadership?: {
    title: string
    description: string
  }
  bottomImage?: {
    file: string
    fileId: string
    thumbnail: string
  }
}) {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne()
    if (!aboutus) {
      return {
        success: false,
        error: 'About Us data not found'
      }
    }

    // Update only the specified fields, preserving existing data
    if (data.title !== undefined) {
      aboutus.title = data.title
    }

    if (data.backgroundImage) {
      aboutus.backgroundImage = data.backgroundImage
    }

    if (data.leadership) {
      if (!aboutus.leadership) {
        aboutus.leadership = { title: '', description: '', leaders: [] }
      }
      aboutus.leadership.title = data.leadership.title
      aboutus.leadership.description = data.leadership.description
      // Preserve existing leaders
    }

    if (data.bottomImage) {
      aboutus.bottomImage = data.bottomImage
    }

    await aboutus.save()

    revalidatePath('/dashboard/about')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    console.error('Error updating basic About Us data:', error)
    return {
      success: false,
      error: error.message || 'Failed to update basic About Us data'
    }
  }
}
