import { getProductDetails } from "@/actions/data/product";

export default async function ProductDetailsPage({ params }: any) {
  console.log('params :>> ', params);

  const data = await getProductDetails(params?.productId)
  const siteData = data?.data
  console.log('data :>> ', data);


  return (
    <>

    </>
  )
}
