'use client'

import { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper' // Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination' // Add pagination styles
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'

type TestimonialItem = {
  name: string
  designation: string
  message: string
}

type TestimonialsSection = {
  title?: string
  subtitle?: string
  items?: TestimonialItem[]
}

type TProps = {
  data?: TestimonialsSection
}

const TestimonialItem = ({ data }: { data: TestimonialItem }) => {
  return (
    <div className='z-10 flex flex-col justify-center bg-white h-full text-start cursor-pointer'>
      <p className='mb-4 text-gray-600 text-lg line-clamp-6 lg:line-clamp-5 leading-loose'>
        {data?.message}
      </p>
      <h4 className='font-semibold text-gray-900'>{data?.name}</h4>
      <p className='text-gray-500'>{data?.designation}</p>
    </div>
  )
}

export const TestimonialCarousel = ({ data }: TProps) => {
  const swiperRef = useRef<SwiperRef>(null)
  const [index, setIndex] = useState(0)
  const [firstWord, ...rest] = (data?.title || '').split(' ')

  const handleSlideChange = (swiper: SwiperType) => {
    setIndex(swiper.realIndex)
  }

  // Update the handleDotClick to use swiper property
  const handleDotClick = (slideIndex: number) => {
    swiperRef.current?.swiper.slideTo(slideIndex)
  }

  return (
    <div className='relative space-y-6 lg:ml-auto w-full max-w-5xl overflow-hidden'>
      {/* Controls */}
      <div className='flex justify-between items-center mt-2'>
        <div className='space-y-2'>
          <p className='font-semibold text-primary text-sm uppercase'>{data?.subtitle}</p>
          <h2 className='font-bold text-4xl'>
            {firstWord} <span className='text-primary'>{rest.join(' ')}</span>
          </h2>
        </div>
        <div className='flex gap-2'>
          {/* pagination buttons */}
          {data?.items?.map((_, i) => (
            <div
              key={i}
              onClick={() => handleDotClick(i)}
              className={`size-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                i === index ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Animated carousel */}
      {data?.items?.length && (
        <Swiper
          ref={swiperRef}
          className='testimonialSwipe'
          loop={true}
          pagination={{
            clickable: false,
            bulletActiveClass: 'bg-primary',
            bulletClass: 'swiper-pagination-bullet'
          }}
          onSlideChange={handleSlideChange}
        >
          {data.items?.map((items, idx) => (
            <SwiperSlide key={idx} className='h-full'>
              <TestimonialItem data={items} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}
