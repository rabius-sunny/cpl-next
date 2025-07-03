'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

interface HeaderBannerSectionProps {
  data: HeaderBannerSection
}

export default function HeaderBannerSection({ data }: HeaderBannerSectionProps) {
  return (
    <section>
      {data.image?.file && (
        <div className='relative'>
          {/* Animate Background Image */}
          <motion.div
            initial={{ opacity: 0.5, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Image
              src={data.image.file || '/placeholder.webp'}
              alt={data.title || 'Header banner'}
              width={1920}
              height={1080}
              className='brightness-80 w-full h-32 lg:h-48 object-cover'
              priority
            />
          </motion.div>

          {/* Animate Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className='absolute inset-0 flex justify-center items-center font-bold text-white text-3xl md:text-5xl xl:text-7xl text-center'
          >
            {data.title}
          </motion.h1>
        </div>
      )}
    </section>
  )
}
