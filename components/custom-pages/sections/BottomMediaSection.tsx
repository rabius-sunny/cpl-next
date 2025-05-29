import Image from 'next/image'

interface BottomMediaSectionProps {
  data: BottomMediaSection
}

export default function BottomMediaSection({ data }: BottomMediaSectionProps) {
  const { media, type = 'image', title, description } = data

  return (
    <section className='py-16 bg-gray-900 text-white'>
      <div className='container mx-auto px-4'>
        <div className='max-w-6xl mx-auto text-center'>
          {(title || description) && (
            <div className='mb-12'>
              {title && <h2 className='text-3xl md:text-4xl font-bold mb-4'>{title}</h2>}
              {description && (
                <p className='text-xl text-gray-300 max-w-3xl mx-auto'>{description}</p>
              )}
            </div>
          )}

          {media?.file && (
            <div className='relative w-full max-w-4xl mx-auto'>
              {type === 'video' ? (
                <div className='relative aspect-video'>
                  <video
                    src={media.file}
                    controls
                    className='w-full h-full rounded-lg'
                    preload='metadata'
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className='relative aspect-video'>
                  <Image
                    src={media.file}
                    alt={title || 'Bottom media'}
                    fill
                    className='object-cover rounded-lg'
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
