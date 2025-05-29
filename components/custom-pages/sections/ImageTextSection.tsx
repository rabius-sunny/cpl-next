import Image from 'next/image'

interface ImageTextSectionProps {
  data: ImageTextSection
}

export default function ImageTextSection({ data }: ImageTextSectionProps) {
  const { image, title, content, imagePosition = 'left' } = data

  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4'>
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 ${
            imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Image */}
          {image?.file && (
            <div className='flex-1 w-full'>
              <div className='relative aspect-[4/3] w-full max-w-2xl mx-auto'>
                <Image
                  src={image.file}
                  alt={title || 'Section image'}
                  fill
                  className='object-cover rounded-lg'
                />
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className='flex-1 w-full'>
            {title && (
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>{title}</h2>
            )}
            {content && (
              <div
                className='prose prose-lg max-w-none text-gray-700 leading-relaxed'
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
