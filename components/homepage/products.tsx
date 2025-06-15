import { getProducts } from "@/actions/data/product";
import { cn } from "@/lib/utils";
import ProductCard from "../common/ProductCard";

type TPops = {
  data?: StatsSection
}

export default async function ProductsSection({ data }: TPops) {
  const products = await getProducts()

  return (
    <section id="about_us" className={cn("py-8 lg:py-16 bg-white")}>
      <div className="lg:space-y-28 mx-auto px-4 max-w-7xl container">
        <div className="flex lg:flex-row flex-col justify-between gap-6 w-full">
          <h2 className="font-bold text-primary text-3xl lg:text-5xl">Our Products</h2>
          <div className="max-w-lg text-gray-500">
            <p>CPML continuously strives to build a reputation for delivery of quality products and services of all scales and complexity, to the satisfaction of our customers.</p>
          </div>
        </div>
        <div className="gap-8 grid grid-cols-none lg:grid-cols-3">
          {products?.data?.map((item: Product, index: number) => (
            <ProductCard item={item} key={index} />
          ))}
        </div>
      </div>
    </section >
  )
}
