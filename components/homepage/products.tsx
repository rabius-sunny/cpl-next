import { getProducts } from "@/actions/data/product";
import { cn } from "@/lib/utils";
import ProductCard from "../common/ProductCard";

type TPops = {
    data?: StatsSection
}


export default async function ProductsSection({ data }: TPops) {
    const products = await getProducts()

    console.log('result :>> ', products);
    return (
        <section id="about_us" className={cn("py-20 bg-white")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="gap-8 grid grid-cols-none lg:grid-cols-3">
                    {products?.data?.map((item: Product, index: number) => (
                        <ProductCard item={item} key={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
