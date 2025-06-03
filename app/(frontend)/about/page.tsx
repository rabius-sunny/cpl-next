import { retrieveAboutus } from '@/actions/data/homepage'

export default async function page() {
  const data = await retrieveAboutus()
  if (!data.success || !data?.data) {
    return <div>Error loading data</div>
  }
  console.log('data', data.data)
  return <div>page</div>
}
