import { retrieveAboutus } from '@/actions/data/homepage'
import AboutPageContent from '@/components/custom-pages/about-page'

export default async function Page() {
  const data = await retrieveAboutus()
  if (!data.success || !data?.data) {
    return <div>Error loading data</div>
  }

  return <AboutPageContent data={data?.data} />
}
