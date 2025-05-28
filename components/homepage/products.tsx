import ProductItem from '../common/product-item'

type TProps = {
  data: Products | undefined
}

export default function Products({ data }: TProps) {
  // if (!data?.length) return null

  return (
    <section className='py-20' id='our_products'>
      <div className='space-y-6 mx-auto px-4 container'>
        <div className='flex justify-between'>
          <h2 className='font-medium text-xl md:text-2xl'>{data?.leftText}</h2>
          <h2 className='font-medium text-xl md:text-2xl text-right'>{data?.rightText}</h2>
        </div>

        <div className="gap-6 grid grid-cols-2 lg:grid-cols-4">
          {data?.items?.map((item: ProductItem, idx) => (
            <ProductItem item={item} key={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
