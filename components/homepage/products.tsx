import { getProducts } from '@/actions/data/product'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type TPops = {
  data?: StatsSection
}

export default async function ProductsSection({ data }: TPops) {
  const products = await getProducts()

  return (
    <section id='about_us' className={cn('py-20 bg-white')}>
      <div className='mx-auto px-4 max-w-7xl container'>
        <div className='gap-8 grid grid-cols-3'>
          {products?.data?.map((item: Product, index: number) => (
            <div key={index}>
              <Image src={item.thumbnail?.file || ''} height={400} width={400} alt='' />
              <div id='description' className='space-y-4 bg-secondary p-5'>
                <h4 className='font-semibold text-lg'>{item?.name}</h4>
                <p className=''>{item?.description}</p>
                <Link href={'/#'}>See more</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
