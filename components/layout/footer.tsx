import { retrieveHomepage } from "@/actions/data/homepage";

export default async function Footer() {
  const data = await retrieveHomepage()

  const siteData = data?.data?.footer
  return (
    <footer className="bg-slate-800 py-20 text-white">
      <div className="mx-auto px-4 container">
        <div className="justify-center gap-16 lg:gap-24 grid grid-cols-none sm:grid-cols-2 lg:grid-cols-3 w-full">

          {/* <div className="space-y-5 col-span-full lg:col-span-1">
            <h2 className="text-3xl">About Us</h2>
            <p className="font-light">{siteData?.aboutText}</p>
          </div> */}

          <div className="space-y-5">
            <h2 className="text-3xl">Get in Touch</h2>

            <div className="space-y-3 lg:space-y-5">
              {/* {siteData?.footer?.getInTouch?.map((item) =>
                <p className="space-x-2" key={item?.key}>
                  <span className="inline-block md:min-w-20 font-normal">{item?.key}:</span>
                  <span className="font-light">{item?.value}</span>
                </p>
              )} */}
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-3xl">Social Media</h2>

            <div className="space-y-4">
              {/* <p className="font-light">{siteData?.footer?.socialMoto}</p> */}

              <div className="inline-flex gap-2">
                {/* {siteData?.footer?.socialLinks?.map((item, idx) =>
                  <Link href={item?.link || '#'} key={idx} target="_blank" className="flex justify-center items-center bg-primary-foreground hover:bg-secondary rounded-full size-10">
                    {item?.icon && <SocialIcon network={item?.icon} size={20} />}
                  </Link>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
