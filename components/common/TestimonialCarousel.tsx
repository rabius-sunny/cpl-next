'use client'

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

type TProps = {
    data?: TestimonialsSection
}


export const TestimonialCarousel = ({ data }: TProps) => {
    const [index, setIndex] = useState(0)
    const [firstWord, ...rest] = (data?.title || '').split(" ");
    // const total = data?.items?.length ?? 0

    // const paginate = (direction: number) => {
    //     setIndex((prev) => (prev + direction + total) % total)
    // }

    return (
        <div className="relative space-y-6 lg:ml-auto w-full max-w-5xl">
            {/* Controls */}
            <div className="flex justify-between items-center mt-2">
                <div className="space-y-2">
                    <p className='font-semibold text-primary text-sm uppercase'>{data?.subtitle}</p>
                    <h2 className='font-bold text-4xl'>{firstWord} <span className='text-primary'>{rest}</span></h2>
                </div>
                <div className="flex gap-2">
                    {data?.items?.map((_, i) => (
                        <div
                            key={i}
                            className={`size-2.5 rounded-full transition-colors duration-300 cursor-pointer ${i === index ? 'bg-primary' : 'bg-gray-300'
                                }`}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>
            </div>

            {/* Fixed height container for smooth layout */}
            <AnimatePresence mode="wait" custom={index}>
                <motion.div
                    key={index}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    // drag="x"
                    // dragConstraints={{ left: 0, right: 0 }}
                    // dragElastic={0.8}
                    // onDragEnd={(e, { offset, velocity }) => {
                    //     const swipe = offset.x + velocity.x * 20
                    //     if (swipe < -100) paginate(1)
                    //     else if (swipe > 100) paginate(-1)
                    // }}
                    className="w-full h-64 cursor-grab active:cursor-grabbing"
                >
                    {data?.items && <TestimonialItem data={data.items[index]} />}
                </motion.div>

            </AnimatePresence>
        </div>
    )
}

const TestimonialItem = ({ data }: { data: TestimonialItem }) => {
    return (
        <div className="flex flex-col justify-center h-full text-start">
            <p className="mb-4 text-gray-600 text-lg line-clamp-6 lg:line-clamp-5 leading-loose">{data?.message}</p>
            <h4 className="font-semibold text-gray-900">{data?.name}</h4>
            <p className="text-gray-500">{data?.designation}</p>
        </div>
    )
}
