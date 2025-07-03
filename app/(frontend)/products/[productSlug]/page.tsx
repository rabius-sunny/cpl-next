import { getProductDetails } from "@/actions/data/product";
import ProductPage from "@/components/custom-pages/product-page";


type TProps = {
  params: Params<'productSlug'>
}

export default async function ProductDetailsPage({ params }: TProps) {
  const pageParams = await params
  const data = await getProductDetails(pageParams?.productSlug)

  return <ProductPage data={data?.data} />
}
