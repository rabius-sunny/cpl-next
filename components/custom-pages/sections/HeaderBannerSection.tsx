import Image from 'next/image'

interface HeaderBannerSectionProps {
  data: HeaderBannerSection
}

export default function HeaderBannerSection({ data }: HeaderBannerSectionProps) {
  return (
    <section className='relative min-h-[500px]  text-white flex items-center justify-center'>
      {/* Background Image */}
      {data.image?.file && (
        <div className='absolute inset-0'>
          <Image
            src={data.image.file}
            alt={data.title || 'Header banner'}
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-black/30 bg-opacity-40' />
        </div>
      )}

      {/* Content */}
      <div className='relative z-10 container mx-auto px-4 text-center'>
        {data.title && (
          <h1 className='text-4xl md:text-6xl font-bold mb-4 leading-tight'>{data.title}</h1>
        )}
        {data.subtitle && (
          <p className='text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto'>{data.subtitle}</p>
        )}
      </div>
    </section>
  )
}
