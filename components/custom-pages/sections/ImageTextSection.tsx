'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

interface ImageTextSectionProps {
  data: ImageTextSection
}

export default function ImageTextSection({ data }: ImageTextSectionProps) {
  const { image, title, content, imagePosition = 'left' } = data

  // Determine directions
  const imageFrom = imagePosition === 'right' ? 100 : -100
  const textFrom = imagePosition === 'right' ? -100 : 100

  return (
    <section className='bg-white py-16'>
      <div className='box'>
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 ${imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
            }`}
        >
          {/* Image */}
          {image?.file && (
            <motion.div
              initial={{ opacity: 0, x: imageFrom }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.4 }}
              className='flex-1 w-full'
            >
              <div className='relative mx-auto w-full max-w-2xl aspect-4/3'>
                <Image
                  src={image.file || '/placeholder.webp'}
                  alt={title || 'Section image'}
                  fill
                  className='rounded-lg object-cover'
                />
              </div>
            </motion.div>
          )}

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: textFrom }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            viewport={{ once: true, amount: 0.4 }}
            className='flex-1 w-full'
          >
            {title && (
              <h2 className='mb-6 font-bold text-gray-900 text-3xl md:text-4xl'>
                {title}
              </h2>
            )}
            {content && (
              <div
                className='max-w-none text-gray-700 leading-relaxed prose prose-lg'
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
