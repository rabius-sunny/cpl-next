import { retrieveHomepage } from "@/actions/data/homepage";
import AboutSection from "@/components/homepage/about";
import Banner from "@/components/homepage/banner";
import VideoSection from "@/components/homepage/video";

export default async function HomePage() {

  const data = await retrieveHomepage()
  const siteData = data?.data
  return (
    <>
      <Banner data={siteData.sliders} />
      <AboutSection data={siteData.about} />
      <VideoSection data={siteData.video} />
    </>
  )
}
