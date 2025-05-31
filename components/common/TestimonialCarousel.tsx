'use client'

import { AnimatePresence, motion, PanInfo } from 'motion/react'
import { useCallback, useState } from 'react'

type TProps = {
  data?: TestimonialsSection
}

export const TestimonialCarousel = ({ data }: TProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const totalItems = data?.items?.length ?? 0
  const [firstWord, ...rest] = (data?.title || '').split(' ')

  const changeSlide = useCallback(
    (newIndex: number) => {
      if (newIndex < 0) {
        setCurrentIndex(totalItems - 1)
      } else if (newIndex >= totalItems) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(newIndex)
      }
    },
    [totalItems]
  )

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setDragOffset(info.offset.x)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    setDragOffset(0)

    const threshold = 50
    const velocity = info.velocity.x
    const offset = info.offset.x

    // Determine if we should change slides based on drag distance and velocity
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 500) {
        // Dragged right or fast right velocity - go to previous
        changeSlide(currentIndex - 1)
      } else if (offset < 0 || velocity < -500) {
        // Dragged left or fast left velocity - go to next
        changeSlide(currentIndex + 1)
      }
    }
  }

  if (!data?.items?.length) return null

  return (
    <div className='relative space-y-6 lg:ml-auto w-full max-w-5xl'>
      {/* Header */}
      <div className='flex justify-between items-center mt-2'>
        <div className='space-y-2'>
          <p className='font-semibold text-primary text-sm uppercase'>{data?.subtitle}</p>
          <h2 className='font-bold text-4xl'>
            {firstWord} <span className='text-primary'>{rest.join(' ')}</span>
          </h2>
        </div>

        {/* Pagination Dots */}
        <div className='flex gap-2'>
          {data.items.map((_, index) => (
            <button
              key={index}
              className={`size-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => changeSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Testimonial Container */}
      <div className='relative w-full h-64 overflow-hidden bg-red-300'>
        <motion.div
          className='w-full h-full cursor-grab active:cursor-grabbing select-none'
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            x: isDragging ? dragOffset * 0.3 : 0 // Reduced drag visual feedback
          }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut'
              }}
              className='absolute inset-0 flex items-start justify-start'
            >
              <TestimonialItem data={data.items[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

const TestimonialItem = ({ data }: { data: TestimonialItem }) => {
  return (
    <div className='w-full h-full'>
      <div className='text-start space-y-4'>
        <div className='relative'>
          <blockquote className='text-lg lg:text-xl text-gray-600 leading-relaxed font-light'>
            {data?.message}
          </blockquote>
        </div>

        <div className='space-y-1'>
          <h4 className='font-semibold text-gray-900 text-lg'>{data?.name}</h4>
          <p className='text-gray-500 text-sm'>{data?.designation}</p>
        </div>
      </div>
    </div>
  )
}
