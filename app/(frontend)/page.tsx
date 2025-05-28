import { retrieveHomepage } from "@/actions/data/homepage";
import Banner from "@/components/homepage/banner";

export default async function HomePage() {

  const data = await retrieveHomepage()
  const siteData = data?.data
  return (
    <>
      <Banner data={siteData.sliders} />
    </>
  )
}
