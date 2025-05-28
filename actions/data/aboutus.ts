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
        history: {
          title: '',
          description: '',
          image: { file: '', fileId: '', thumbnail: '' }
        },
        mission: {
          title: '',
          description: '',
          image: { file: '', fileId: '', thumbnail: '' }
        },
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
