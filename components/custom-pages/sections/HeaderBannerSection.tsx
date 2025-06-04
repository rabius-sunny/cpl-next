import Image from 'next/image'

interface HeaderBannerSectionProps {
  data: HeaderBannerSection
}

export default function HeaderBannerSection({ data }: HeaderBannerSectionProps) {
  return (
    <section className=''>
      {/* Background Image */}
      {data.image?.file && (
        <div className='relative'>
          <Image
            src={data.image.file || '/placeholder.webp'}
            alt={data.title || 'Header banner'}
            width={1920}
            height={1080}
            className='w-full h-32 lg:h-48 object-cover brightness-80'
            priority
          />
          <h1 className='text-white absolute inset-0 flex items-center justify-center text-3xl md:text-5xl xl:text-7xl font-bold text-center'>
            {data.title}
          </h1>
        </div>
      )}
    </section>
  )
}
