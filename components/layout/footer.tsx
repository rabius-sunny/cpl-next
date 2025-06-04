import { retrieveHomepage } from "@/actions/data/homepage";
import Link from "next/link";
import AnimatedButton from "../common/AnimatedButton";
import SocialIcon from "../ui/SocialIcon";

export default async function Footer() {
  const data = await retrieveHomepage()
  const siteData = data?.data?.footer

  return (
    <footer className="bg-slate-800 text-white">
      <div className="py-20">
        <div className="mx-auto px-4 max-w-7xl container">
          <div className="lg:justify-center gap-16 lg:gap-24 grid grid-cols-none sm:grid-cols-2 lg:grid-cols-3 [&_p]:mb-1.5 w-full [&_p]:font-medium [&_h2]:text-primary">

            <div className="space-y-6 col-span-full lg:col-span-1">
              <h2 className="font-bold text-xl">Contacts Information (Office)</h2>
              {siteData?.office?.items?.map((data, idx) => <p key={idx}>{data}</p>)}
            </div>

            <div className="space-y-6 col-span-full lg:col-span-1">
              <h2 className="font-bold text-xl">Contacts Information (Factory)</h2>
              {siteData?.factory?.items?.map((data, idx) => <p key={idx}>{data}</p>)}
            </div>

            <div className="space-y-6">
              <div className="space-y-5">
                <h2 className="font-bold text-xl">Our Social Engagements</h2>
                <div className="inline-flex gap-6">
                  {siteData?.social?.map((item, idx) =>
                    <Link href={item?.link || '#'} key={idx} target="_blank">
                      {item?.icon && <SocialIcon network={item?.icon} size={20} />}
                    </Link>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="font-bold text-xl">Contact Information</h2>
                <div className="space-y-4">
                  <p>If you have any query feel free to contact with us</p>
                  <AnimatedButton href={data?.data?.nav?.cta?.link || ''} className="block text-center">
                    {data?.data?.nav?.cta?.text}
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-10 border-gray-700 border-t">
        <div className="flex lg:flex-row flex-col justify-between items-center gap-6 mx-auto px-4 max-w-7xl lg:text-inherit text-center container">
          <p>{siteData?.copyright}</p>
          <div className="flex [&>*]:px-4 [&>*:last-child]:pr-0 divide-x divide-gray-300 leading-tight">
            <Link href='/privacy'>Privacy Policy</Link>
            <Link href='/terms'>Terms and Condition</Link>
          </div>
        </div>
      </div>
    </footer >
  )
}
