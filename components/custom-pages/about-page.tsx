'use client'

import { cn } from '@/lib/utils'
import { useScrollToHash } from '@/utils/scrollTo'
import { motion } from 'motion/react'
import Image from 'next/image'

type TProps = {
    data: Aboutus
}

export default function AboutPageContent({ data }: TProps) {
    const fadeIn = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
    }

    const slideFrom = (dir: 'left' | 'right') => ({
        initial: { opacity: 0, x: dir === 'left' ? -80 : 80 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
        viewport: { once: true, amount: 0.4 },
    })


    useScrollToHash(150)

    return (
        <div className='gap-8 md:gap-20 lg:gap-28 grid'>
            {/* Hero Section */}
            <div className='relative'>
                <motion.div
                    initial={{ opacity: 0.5, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <Image
                        src={data?.backgroundImage?.file || '/placeholder.webp'}
                        alt={data.title || 'Header banner'}
                        width={1920}
                        height={1080}
                        className='brightness-80 w-full h-32 lg:h-48 object-cover'
                        priority
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className='absolute inset-0 flex justify-center items-center font-bold text-white text-3xl md:text-5xl lg:text-7xl xl:text-9xl text-center'
                >
                    {data?.title}
                </motion.h1>
            </div>

            {/* About Sections */}
            <div className='gap-8 md:gap-20 lg:gap-28 grid box'>
                {data?.sections?.map((section, idx) => {
                    const isOdd = idx % 2 !== 0
                    return (
                        <div
                            key={idx}
                            className='xl:items-end gap-12 grid grid-cols-1 lg:grid-cols-2'
                            id={section?.title?.toLocaleLowerCase()?.replaceAll(' ', '-')}

                        >
                            {/* Image with animation */}
                            <motion.div
                                {...slideFrom(isOdd ? 'right' : 'left')}
                                className={cn('order-first', isOdd && 'lg:order-last')}
                            >
                                <Image
                                    src={section.image?.file || '/placeholder.webp'}
                                    alt={'Section Image'}
                                    width={1920}
                                    height={900}
                                    className='size-full object-cover'
                                />
                            </motion.div>

                            {/* Text */}
                            <motion.div
                                {...slideFrom(isOdd ? 'left' : 'right')}
                                className='flex flex-col gap-3'
                            >
                                <h2 className='font-bold text-primary text-3xl text-center lg:text-start'>
                                    {section.title}
                                </h2>
                                <div className='flex justify-center lg:justify-start'>
                                    <div className='bg-primary w-12 h-1' />
                                </div>
                                <p className='mt-4 font-medium text-justify'>{section.description}</p>
                            </motion.div>
                        </div>
                    )
                })}
            </div>

            {/* Leadership Header */}
            <motion.div
                {...fadeIn}
                className='flex flex-col justify-center items-center gap-3 box'
                id='leadership'
            >
                <h2 className='font-bold text-primary text-4xl text-center'>
                    {data?.leadership?.title || 'Leadership Team'}
                </h2>
                <div className='bg-primary w-12 h-1' />
                <p className='mt-2 font-medium text-center'>
                    {data?.leadership?.description || 'No description available.'}
                </p>
            </motion.div>

            {/* Leadership Members */}
            <div className='gap-12 grid grid-cols-1 lg:grid-cols-2 box' id='membership'>
                {data?.leadership?.leaders?.map((item, idx) => (
                    <motion.div
                        key={idx}
                        {...slideFrom(idx % 2 === 0 ? 'left' : 'right')}
                        className='flex flex-col'
                    >
                        <h1 className='font-bold text-xl'>{item.name}</h1>
                        <p className='font-semibold'>{item.designation}</p>
                        <p className='mt-4 font-medium'>{item.bio}</p>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Image */}
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                viewport={{ once: true }}
                className='mb-20 box'
            >
                <Image
                    src={data?.bottomImage?.file || '/placeholder.webp'}
                    alt='Bottom Image'
                    width={1920}
                    height={1080}
                    className='w-full h-auto object-cover'
                />
            </motion.div>
        </div>
    )
}
