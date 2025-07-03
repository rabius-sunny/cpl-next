import { retrieveHomepage } from "@/actions/data/homepage";
import ContactPageContent from "@/components/custom-pages/contact-page";

export default async function ContactPage() {
  const data = await retrieveHomepage()
  const siteData = data?.data?.footer

  if (!siteData) return "No data found!"

  return <ContactPageContent data={siteData} />
}
