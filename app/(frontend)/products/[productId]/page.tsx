import { getProductDetails } from "@/actions/data/product";
import { cn } from "@/lib/utils";


type TProps = {
  params: Params<'productId'>
}

export default async function ProductDetailsPage({ params }: TProps) {
  const pageParams = await params

  const data = await getProductDetails(pageParams?.productId)
  const productData = data?.data
  console.log('data :>> ', data.data?.features);


  return (
    <section id="about_us" className={cn("py-20")}>
      <div className="mx-auto px-4 max-w-7xl container">
        <div className="flex gap-20">
          <div className="space-y-8 w-full lg:w-1/2">
            <h1 className="font-bold text-gray-700 text-3xl lg:text-6xl">{productData?.name}</h1>
            <p className="text-base leading-loose">{productData?.description}</p>

            <div className="space-y-2">
              {data.data?.features?.map((feature: { key: string; value: string }, idx: number) => (
                <div className="space-x-2" key={idx}>
                  <span className="font-semibold">{feature?.key}:</span>
                  <span>{feature?.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            ...
          </div>
        </div>
      </div>
    </section>
  )
}
