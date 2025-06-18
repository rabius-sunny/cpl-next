import { getPageBySlug } from '@/actions/data/pages'
import CustomPageRenderer from '@/components/custom-pages/CustomPageRenderer'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CustomPage({ params }: PageProps) {
  const { slug } = await params

  try {
    const result = await getPageBySlug(slug)

    if (!result.success || !result.data) {
      notFound()
    }

    const page = result.data

    if (!page.isPublished) {
      notFound()
    }

    return <CustomPageRenderer page={page} />
  } catch (error) {
    console.error('Error loading custom page:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  try {
    const result = await getPageBySlug(slug)

    if (!result.success || !result.data) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.'
      }
    }

    const page = result.data

    return {
      title: page.title,
      description: `Custom page: ${page.title}`
    }
  } catch (error) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    }
  }
}
