import { retrieveHomepage } from "@/actions/data/homepage";
import AboutSection from "@/components/homepage/about";
import Banner from "@/components/homepage/banner";
import ProductsSection from "@/components/homepage/products";
import StatisticsSection from "@/components/homepage/statistics";
import { TestimonialSection } from "@/components/homepage/testimonials";
import VideoSection from "@/components/homepage/video";

export default async function HomePage() {

  const data = await retrieveHomepage()
  const siteData = data?.data
  return (
    <>
      <Banner data={siteData.sliders} />
      <AboutSection data={siteData.about} />
      <ProductsSection data={siteData.stats} />
      <StatisticsSection data={siteData.stats} />
      <TestimonialSection data={siteData.testimonials} />
      <VideoSection data={siteData.video} />
    </>
  )
}
