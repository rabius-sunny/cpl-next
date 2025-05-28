"use client"

import { Button } from "@/components/ui/button"
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

    const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
    const overlayY = useTransform(scrollY, [0, 500], [0, -100])
    const textY = useTransform(scrollY, [0, 500], [0, 200])

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % data?.length!)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    if (!data?.length) return null

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % data.length)
        setIsAutoPlaying(false)
    }

    const prevSlide = () => {
        data
        setCurrentSlide((prev) => (prev - 1 + data.length) % data.length)
        setIsAutoPlaying(false)
    }

    return (
        <div className="relative bg-gray-100 py-32 h-auto overflow-hidden">
            {/* Background Images with Parallax */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bg-${currentSlide}`}
                    initial={{ scale: 1.1, opacity: 0, y: -1000 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -1000 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{ y: backgroundY }}
                >
                    <div
                        className="bg-cover bg-no-repeat bg-center w-full h-full"
                        style={{ backgroundImage: `url(${data[currentSlide].backgroundImage?.file})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                </motion.div>
            </AnimatePresence>


            {/* Mobile Product Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`mobile-products-${currentSlide}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="md:hidden right-0 bottom-24 left-0 z-30 absolute px-6"
                >
                    <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide">
                        {data[currentSlide]?.images?.map((product, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className="relative flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm w-24 h-32 overflow-hidden"
                                    style={{
                                        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Image src={product.file || "/placeholder.svg"} alt="Product" fill className="object-cover" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Main Content */}
            <motion.div className="z-20 relative flex items-center h-full" style={{ y: textY }}>
                <div className="mx-auto px-6 container">
                    <div className="flex justify-between gap-40">
                        <div className="max-w-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`content-${currentSlide}`}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -50 }}
                                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                                >

                                    <motion.h1
                                        className="mb-6 font-bold text-white text-5xl md:text-7xl leading-tight"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                    >
                                        {data[currentSlide].title}
                                    </motion.h1>

                                    <motion.h3
                                        className="mb-4 font-medium text-gray-400 text-lg"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                    >
                                        {data[currentSlide].subtitle}
                                    </motion.h3>

                                    {/* <motion.p
                                        className="mb-8 text-white/80 text-xl leading-relaxed"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                    >
                                        {data[currentSlide].description}
                                    </motion.p> */}

                                    {/* <motion.div
                                        className="flex sm:flex-row flex-col gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                    >
                                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8 py-3 text-white text-lg">
                                            Explore Products
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="hover:bg-white px-8 py-3 border-white text-white hover:text-gray-900 text-lg"
                                        >
                                            <Play className="mr-2 w-5 h-5" />
                                            Watch Video
                                        </Button>
                                    </motion.div> */}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* 3D Staggered Product Images - Right Side */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`products-${currentSlide}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, delay: 0.5, }}
                                className="hidden md:block"
                                style={{ perspective: "1000px" }}
                            >
                                <div className="relative" style={{ transformStyle: "preserve-3d", width: "350px", height: "420px" }}>
                                    {data[currentSlide].images?.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="absolute origin-center"
                                            initial={{
                                                opacity: 0,
                                                x: index + 5 * 50,
                                                y: index + 5 * 50,
                                                rotateY: -index + 5 * 50,
                                                scale: 0.8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 10 * index,
                                                y: 10 * index,
                                                rotateY: index - 15,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0, x: 500 * index,
                                                y: 50 * index,
                                                rotateY: 150 * index,
                                                scale: 0.8,
                                            }}
                                            transition={{
                                                delay: index * 0.1,
                                                duration: 0.8,
                                                ease: "easeOut",
                                                type: "spring",
                                                stiffness: 100,
                                            }}
                                            // whileHover={{
                                            //     scale: 1.05,
                                            //     rotateY: product.offset.rotate - 5,
                                            //     transition: { duration: 0.3 },
                                            // }}
                                            style={{
                                                zIndex: (data[currentSlide]?.images?.length ?? 0) * index,
                                                filter: "drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.3))",
                                            }}
                                        >
                                            {/* Paper Package */}
                                            <div className="relative w-75 h-96 cursor-pointer">
                                                <Image src={item.file!} alt="" fill />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </motion.div>

            {/* Slide Navigation */}
            <div className="bottom-8 left-1/2 z-30 absolute flex items-center space-x-4 -translate-x-1/2">
                <Button variant="ghost" size="icon" onClick={prevSlide} className="hover:bg-white/20 rounded-full text-white">
                    <ChevronLeft className="w-6 h-6" />
                </Button>

                <div className="flex space-x-2">
                    {data.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => {
                                setCurrentSlide(index)
                                setIsAutoPlaying(false)
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-orange-500 w-8" : "bg-white/50"
                                }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </div>

                <Button variant="ghost" size="icon" onClick={nextSlide} className="hover:bg-white/20 rounded-full text-white">
                    <ChevronRight className="w-6 h-6" />
                </Button>
            </div>

            {/* Progress Bar */}
            <motion.div
                className="bottom-0 left-0 z-30 absolute bg-green-500 h-1"
                initial={{ width: "0%" }}
                animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                transition={{ duration: 5, ease: "linear", repeat: isAutoPlaying ? Number.POSITIVE_INFINITY : 0 }}
            />
        </div>
    )
}