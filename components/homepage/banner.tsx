"use client"

import { Button } from "@/components/ui/button"
import { useImageSliderVariants } from "@/hooks/useImageSliderVariants"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

type TPops = {
    data?: SliderItem[]
}

export default function Banner({ data }: TPops) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const { scrollY } = useScroll()
    const [direction, setDirection] = useState(0)

    console.log('data :>> ', data);
    const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
    const textY = useTransform(scrollY, [0, 500], [0, 200])

    // Get total number of images for current slide
    const total = data?.[currentSlide]?.images?.length || 0
    const { getPreset, containerVariants } = useImageSliderVariants(total, total === 3 ? 'vertical' : 'horizontal')

    useEffect(() => {
        if (!isAutoPlaying) return
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % (data?.length || 1))
        }, 5000)
        return () => clearInterval(interval)
    }, [isAutoPlaying, data?.length])

    if (!data?.length) return null

    const [firstWord, ...rest] = (data[currentSlide]?.title || '').split(' ')

    const handleNextSlide = () => {
        setDirection(1)
        setCurrentSlide((prev) => (prev + 1) % data!.length)
        setIsAutoPlaying(false)
    }

    const handlePrevSlide = () => {
        setDirection(-1)
        setCurrentSlide((prev) => (prev - 1 + data!.length) % data!.length)
        setIsAutoPlaying(false)
    }

    return (
        <div className="relative bg-gray-200 overflow-hidden">
            {/* Background Layer */}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                    key={`bg-${currentSlide}`}
                    custom={direction}
                    variants={{
                        initial: (direction: number) => ({
                            position: 'absolute',
                            y: direction >= 0 ? '100%' : '-100%',
                            scale: 1.1,
                            zIndex: 1
                        }),
                        animate: {
                            position: 'absolute',
                            y: 0,
                            scale: 1,
                            zIndex: 2,
                            transition: {
                                duration: 0.2,
                                ease: [0.43, 0.13, 0.23, 0.96]
                            }
                        },
                        exit: (direction: number) => ({
                            position: 'absolute',
                            y: direction >= 0 ? '-100%' : '100%',
                            scale: 0.9,
                            zIndex: 0,
                            transition: {
                                duration: 1.2,
                                ease: [0.43, 0.13, 0.23, 0.96]
                            }
                        })
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ y: backgroundY }}
                >
                    {/* Background Image Layer */}
                    <motion.div
                        className="absolute inset-0 w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: "easeOut",
                                delay: 0.2 // Delay opacity animation to ensure smooth transition
                            }
                        }}
                        exit={{ opacity: 1 }} // Keep opacity 1 on exit
                    >
                        <div
                            className="bg-cover bg-no-repeat bg-center w-full h-full transform-gpu"
                            style={{
                                backgroundImage: `url(${data[currentSlide].backgroundImage?.file})`,
                            }}
                        />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                </motion.div>
            </AnimatePresence>
            {/* Content Layer */}
            <motion.div className="z-20 relative flex items-center h-[60vh]" style={{ y: textY }}>
                <div className="relative mx-auto px-6 border-4 container">
                    <div className="relative flex lg:flex-row flex-col justify-between items-center gap-20">
                        {/* Text Content */}
                        <div className="w-full lg:w-1/2">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`content-${currentSlide}`}
                                    variants={containerVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <motion.h1
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -100, opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            duration: 1.5
                                        }}
                                        className="mb-6 font-raleway font-semibold text-gray-800 text-5xl md:text-6xl capitalize leading-tight"
                                    >
                                        {firstWord} <br /> {rest.join(' ')}
                                    </motion.h1>
                                    <motion.h3
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -100, opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 20,
                                            duration: 1.5,
                                            delay: 0.2
                                        }}
                                        className="mb-4 font-roboto font-light text-zinc-500 text-2xl lg:text-3xl"
                                    >
                                        {data[currentSlide].subtitle}
                                    </motion.h3>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="relative w-full lg:w-1/2">
                            {/* Image Gallery */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`gallery-${currentSlide}`}
                                    className="hidden lg:block"
                                    variants={containerVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <div style={{ perspective: "1000px" }}>
                                        {[...data[currentSlide].images!].map((image, index) => {
                                            const variants = getPreset(index + 2)
                                            return (
                                                <motion.div
                                                    key={index}
                                                    className="-top-6 left-0 absolute w-fit origin-center -translate-y-1/2" variants={variants}
                                                >
                                                    <div className={`relative h-96 w-96 flex items-center justify-center`}>
                                                        <Image
                                                            src={image.file!}
                                                            alt="card"
                                                            fill
                                                            className="object-contain"
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
            <div className="bottom-8 left-1/2 z-30 absolute flex items-center space-x-4 -translate-x-1/2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevSlide}
                    className="bg-primary/20 hover:bg-primary/60 rounded-full text-white hover:text-white"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Button>

                <div className="flex space-x-2">
                    {data.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={handleNextSlide}
                            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? "bg-primary/60 w-8" : "bg-primary/30"
                                }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setCurrentSlide((prev) => (prev + 1) % data.length)
                        setIsAutoPlaying(false)
                    }}
                    className="bg-primary/20 hover:bg-primary/60 rounded-full text-white hover:text-white"
                >
                    <ChevronRight className="w-6 h-6" />
                </Button>
            </div>
        </div>
    )
}