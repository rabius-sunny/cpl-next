import { motion } from 'motion/react';
import Image from 'next/image';

interface BottomMediaSectionProps {
  data: BottomMediaSection
}

export default function BottomMediaSection({ data }: BottomMediaSectionProps) {
  const { media, type = 'image', title, description } = data

  return (
    <section className='py-16 text-white'>
      <div className='box'>
        <div className='text-center'>
          {(title || description) && (
            <div className='mb-12'>
              {title && <h2 className='mb-4 font-bold text-3xl md:text-4xl'>{title}</h2>}
              {description && (
                <p className='mx-auto max-w-3xl text-gray-300 text-xl'>{description}</p>
              )}
            </div>
          )}

          {media?.file && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
              className='relative mx-auto w-full max-w-4xl'
            >
              {type === 'video' ? (
                <div className='relative aspect-video'>
                  <video src={media.file} controls className='size-full' preload='metadata'>
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className='relative aspect-video'>
                  <Image
                    src={media.file || '/placeholder.webp'}
                    alt={title || 'Bottom media'}
                    fill
                    className='rounded-lg object-cover'
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
