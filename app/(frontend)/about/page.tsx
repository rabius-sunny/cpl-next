import { retrieveAboutus } from '@/actions/data/homepage'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default async function page() {
  const data = await retrieveAboutus()
  if (!data.success || !data?.data) {
    return <div>Error loading data</div>
  }
  return (
    <div className='grid gap-8 md:gap-20 lg:gap-28'>
      <div className='relative'>
        <Image
          src={data.data.backgroundImage?.file || '/placeholder.webp'}
          alt='Background'
          width={1920}
          height={1080}
          className='w-full h-32 lg:h-48 object-cover brightness-80'
        />
        <h1 className='text-white absolute inset-0 flex items-center justify-center text-3xl md:text-5xl lg:text-7xl xl:text-9xl font-bold text-center'>
          {data.data.title}
        </h1>
      </div>
      <div className='box grid gap-8 md:gap-20 lg:gap-28'>
        {data.data?.sections?.map((section, idx) => (
          <div key={idx} className='grid grid-cols-1 lg:grid-cols-2 gap-12 xl:items-end'>
            <div className={cn('order-first', idx % 2 !== 0 && 'lg:order-last')}>
              <Image
                src={section.image?.file || '/placeholder.webp'}
                alt={'Section Image'}
                width={1920}
                height={900}
                className='size-full object-cover'
              />
            </div>
            <div className='flex flex-col gap-3'>
              <h2 className='text-3xl text-primary text-center lg:text-start font-bold'>
                {section.title}
              </h2>
              <div className='flex justify-center lg:justify-start'>
                <div className='w-12 h-1 bg-primary' />
              </div>
              <p className='mt-4 text-justify font-medium'>{section.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='box'>
        <div className='flex flex-col justify-center gap-3'>
          <h2 className='text-4xl text-center text-primary font-bold'>
            {data.data.leadership?.title || 'Leadership Team'}
          </h2>
          <div className='flex justify-center '>
            <div className='w-12 h-1 bg-primary' />
          </div>
          <p className='text-center mt-2 font-medium'>
            {data.data.leadership?.description || 'No description available.'}
          </p>
        </div>
      </div>
      <div className='box grid grid-cols-1 lg:grid-cols-2 gap-12 '>
        {data.data.leadership?.leaders?.map((item, idx) => (
          <div key={idx}>
            <h1 className='text-xl font-bold'>{item.name}</h1>
            <p className='font-semibold'>{item.designation}</p>
            <p className='mt-4 font-medium'>{item.bio}</p>
          </div>
        ))}
      </div>
      <div className='box mb-20'>
        <Image
          src={data.data.bottomImage?.file || '/placeholder.webp'}
          alt='Bottom Image'
          width={1920}
          height={1080}
          className='w-full h-auto object-cover'
        />
      </div>
    </div>
  )
}
