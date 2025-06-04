import { retrieveHomepage } from "@/actions/data/homepage";
import BouncyLink from "@/components/common/BouncyLink";
import ContactForm from "@/components/common/contact-form";
import { cn } from "@/lib/utils";

export default async function ContactPage() {
  const data = await retrieveHomepage()
  const siteData = data?.data?.footer

  return (
    <>
      <section id="about_us" className="relative bg-white py-28">


        <div className="z-10 relative">
          <div className="space-y-28 mx-auto px-4 max-w-7xl container">
            <div className="space-y-16 bg-white lg:shadow-xl ml-0 p-5 lg:p-16 rounded-sm w-full max-w-2xl">
              <div className="space-y-6 col-span-full lg:col-span-1">
                <h2 className="font-bold text-primary text-4xl">
                  Corporate Office
                </h2>
                <div className="leading-loose">
                  {siteData?.office?.items?.map((data, idx) => <p key={idx} className={cn({ "mb-4": idx === 1 })}>{data}</p>)}
                </div>
              </div>

              <div className="space-y-6 col-span-full lg:col-span-1">
                <h2 className="font-bold text-primary text-4xl">Factory Office</h2>
                <div className="leading-loose">
                  {siteData?.factory?.items?.map((data, idx) => <p key={idx} className={cn({ "mb-4": idx === 1 })}>{data}</p>)}
                </div>
              </div>

              <div className="relative gap-5 grid grid-cols-none sm:grid-cols-2 w-full">
                <BouncyLink
                  href="/green-initiative"
                  className="inline-block relative bg-primary px-6 py-4 rounded-lg w-full font-semibold text-white text-center"
                >
                  Contact
                </BouncyLink>

                <BouncyLink
                  href={'https://www.google.com/maps/place/Creative+Paper+Mills+Ltd./@23.7582897,90.391711,12z/data=!4m6!3m5!1s0x3755b61df55d91f9:0x2debbb343d8464a7!8m2!3d23.7624931!4d90.5110292!16s%2Fg%2F11dyzdkb_3?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D'}
                  target="_blank"
                  className="inline-block relative bg-primary px-6 py-4 rounded-lg w-full font-semibold text-white text-center"
                >
                  See Google Map
                </BouncyLink>
              </div>
            </div>
          </div>
        </div>
        <div className="z-0 absolute inset-0 bg-amber-100">
          <div className="z-0 absolute inset-0 bg-gray-900/50" />
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d116854.20741097258!2d90.391711!3d23.7582897!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b61df55d91f9%3A0x2debbb343d8464a7!2sCreative%20Paper%20Mills%20Ltd.!5e0!3m2!1sen!2sbd!4v1748942628012!5m2!1sen!2sbd"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section >

      <section id="about_us" className="bg-white py-28">
        <div className="space-y-28 mx-auto px-4 max-w-7xl container">
          <div className="space-y-14 mx-auto p-4 w-full max-w-3xl">
            <h2 className="font-bold text-4xl text-center">
              Get in <span className="text-primary">Touch</span>
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>

  )
}
