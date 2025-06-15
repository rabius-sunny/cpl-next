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

    const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
    const textY = useTransform(scrollY, [0, 500], [0, 200])

    // Get total number of images for current slide
    const total = data?.[currentSlide]?.images?.length || 0
    const dir = data?.[currentSlide]?.direction ?? 'horizontal'
    const { getPreset, containerVariants } = useImageSliderVariants(total, dir)

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
            <motion.div className="z-20 relative flex lg:flex-row flex-col justify-between items-center gap-6 lg:gap-20 mx-auto px-4 py-8 max-w-[1400px] h-[calc(100vh-220px)] lg:h-[60vh] container" style={{ y: textY }}>
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
                                className="mb-6 font-raleway font-semibold text-gray-800 text-4xl md:text-6xl capitalize leading-tight"
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
                                className="mb-4 font-roboto font-light text-zinc-500 text-xl lg:text-3xl"
                            >
                                {data[currentSlide].subtitle}
                            </motion.h3>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Image Gallery */}
                <div className="relative w-full lg:w-1/2 h-[500px] lg:h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`gallery-${currentSlide}`}
                            className="relative flex justify-center items-center mx-auto w-full h-full"
                            variants={containerVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ perspective: "1000px" }}
                        >
                            {[...data[currentSlide].images!].map((image, index) => {
                                const variants = getPreset(index)
                                return (
                                    <motion.div
                                        key={index}
                                        variants={variants}
                                        className="top-1/2 left-1/2 absolute shadow-xl w-[200px] lg:w-[280px] h-[250px] lg:h-[380px] overflow-hidden -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            transformOrigin: "center center",
                                        }}
                                    >
                                        <Image
                                            src={image.file!}
                                            alt={`gallery image ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="relative w-full h-full object-cover"
                                            priority={index === 0}
                                        />
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div >

            {/* Navigation Controls */}
            <div className="hidden bottom-2 lg:bottom-8 left-1/2 z-30 absolute lg:flex items-center space-x-4 -translate-x-1/2" >
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
            </div >
        </div >
    )
}