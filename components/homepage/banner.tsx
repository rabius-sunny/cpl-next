'use client'

import { Button } from '@/components/ui/button'
import { useImageSliderVariants } from '@/hooks/useImageSliderVariants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type TPops = {
  data?: SliderItem[]
}

export default function Banner({ data }: TPops) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { scrollY } = useScroll()

  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
  const textY = useTransform(scrollY, [0, 500], [0, 200])

  // Get total number of images for current slide
  const total = data?.[currentSlide]?.images?.length || 0
  const { getPreset, containerVariants } = useImageSliderVariants(
    total,
    total === 3 ? 'vertical' : 'horizontal'
  )

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (data?.length || 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, data?.length])

  if (!data?.length) return null

  const [firstWord, ...rest] = (data[currentSlide]?.title || '').split(' ')

  return (
    <div className='relative bg-gray-100 overflow-hidden'>
      {/* Background Layer */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className='absolute inset-0'
          style={{ y: backgroundY }}
        >
          <div
            className='bg-cover bg-no-repeat bg-center w-full h-full'
            style={{
              backgroundImage: `url(${data[currentSlide].backgroundImage?.file})`
            }}
          />
          <div className='absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent' />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <motion.div className='z-20 relative flex items-center h-[60vh]' style={{ y: textY }}>
        <div className='relative mx-auto px-6 border-4 container'>
          <div className='relative flex justify-between items-center gap-20'>
            {/* Text Content */}
            <div className='w-full lg:w-1/2'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={`content-${currentSlide}`}
                  variants={containerVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                >
                  <motion.h1 className='mb-6 font-raleway font-semibold text-gray-800 text-5xl md:text-6xl capitalize leading-tight'>
                    {firstWord} <br /> {rest.join(' ')}
                  </motion.h1>
                  <motion.h3 className='mb-4 font-roboto font-light text-zinc-500 text-3xl'>
                    {data[currentSlide].subtitle}
                  </motion.h3>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className='relative w-full lg:w-1/2'>
              {/* Image Gallery */}
              <AnimatePresence mode='wait'>
                <motion.div
                  key={`gallery-${currentSlide}`}
                  className='hidden lg:block'
                  variants={containerVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                >
                  <div
                    className='top-0 absolute inset-0 bg-amber-500'
                    style={{ perspective: '1000px' }}
                  >
                    {[...data[currentSlide].images!].map((image, index) => {
                      const variants = getPreset(index + 2)
                      return (
                        <motion.div
                          key={index}
                          className='top-0 left-0 absolute w-80 origin-center -translate-y-1/2'
                          variants={variants}
                          style={{
                            filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.2))'
                          }}
                        >
                          <div className={`relative h-[30rem]`}>
                            <Image
                              src={image.file! || '/placeholder.webp'}
                              alt='card'
                              fill
                              className='rounded-lg object-cover'
                              priority={index === 0}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className='bottom-8 left-1/2 z-30 absolute flex items-center space-x-4 -translate-x-1/2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            setCurrentSlide((prev) => (prev - 1 + data.length) % data.length)
            setIsAutoPlaying(false)
          }}
          className='hover:bg-white/20 rounded-full text-gray-300'
        >
          <ChevronLeft className='w-6 h-6' />
        </Button>

        <div className='flex space-x-2'>
          {data.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentSlide(index)
                setIsAutoPlaying(false)
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-gray-300 w-8' : 'bg-gray-300/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            setCurrentSlide((prev) => (prev + 1) % data.length)
            setIsAutoPlaying(false)
          }}
          className='hover:bg-white/20 rounded-full text-gray-300'
        >
          <ChevronRight className='w-6 h-6' />
        </Button>
      </div>
    </div>
  )
}
