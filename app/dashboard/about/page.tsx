import { getAboutus } from '@/actions/data/aboutus'
import AdminAboutus from '@/components/dashboard/AdminAboutus'

type TProps = {}

export default async function AboutPage({}: TProps) {
  const result = await getAboutus()

  if (!result.success) {
    console.error('Failed to fetch About Us data:', result.error)
    return (
      <div className='p-4'>
        <h1 className='text-lg font-semibold'>Error</h1>
        <p className='text-red-500'>{result.error}</p>
      </div>
    )
  }

  const aboutusData = result.success ? result.data : null

  return (
    <div>
      <AdminAboutus data={aboutusData} />
    </div>
  )
}
