import { retrieveHomepage } from "@/actions/data/homepage";
import ContactForm from "@/components/common/contact-form";
import { cn } from "@/lib/utils";

export default async function ContactPage() {
  const data = await retrieveHomepage()
  const siteData = data?.data?.footer

  return (
    <section id="about_us" className="bg-white py-28">
      <div className="space-y-28 mx-auto px-4 max-w-7xl container">
        <div className="flex lg:flex-row flex-col justify-between items-center gap-20 w-full">

          <div className="w-full lg:w-1/2">
            <div className="space-y-16 shadow-md lg:shadow-xl p-5 lg:p-16">
              <div className="space-y-4 col-span-full lg:col-span-1">
                <h2 className="font-bold text-primary text-4xl">
                  Corporate Office
                </h2>
                <div className="leading-loose">
                  {siteData?.office?.items?.map((data, idx) => <p key={idx} className={cn({ "mb-4": idx === 1 })}>{data}</p>)}
                </div>
              </div>

              <div className="space-y-4 col-span-full lg:col-span-1">
                <h2 className="font-bold text-primary text-4xl">Factory Office</h2>
                <div className="leading-loose">
                  {siteData?.factory?.items?.map((data, idx) => <p key={idx} className={cn({ "mb-4": idx === 1 })}>{data}</p>)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-14 p-4 w-full lg:w-1/2">
            <h2 className="font-bold text-4xl text-center">
              Get in <span className="text-primary">Touch</span>
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section >
  )
}
