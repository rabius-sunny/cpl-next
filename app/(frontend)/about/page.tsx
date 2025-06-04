import { retrieveAboutus } from '@/actions/data/homepage'
import Image from 'next/image'

export default async function page() {
  const data = await retrieveAboutus()
  if (!data.success || !data?.data) {
    return <div>Error loading data</div>
  }
  return (
    <div className='grid gap-8 md:gap-12 lg:gap-16'>
      <div>
        <Image
          src={data.data.backgroundImage?.file || '/placeholder.webp'}
          alt='Background'
          width={1920}
          height={1080}
          className='w-full h-auto object-cover'
        />
      </div>
      <div className='box'>
        {data.data?.sections?.map((section, idx) => (
          <div key={idx} className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            <div>
              <Image
                src={section.image?.file || '/placeholder.webp'}
                alt={'Section Image'}
                width={1920}
                height={900}
                className='size-full object-cover'
              />
            </div>
            <div>
              <h2 className='text-3xl text-primary  font-bold'>{section.title}</h2>
              <p className='mt-4'>{section.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='box'></div>
      <div className='box'></div>
      <div className='box'></div>
    </div>
  )
}
