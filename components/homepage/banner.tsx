"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

const bannerSlides = [
    {
        id: 1,
        title: "Premium Paper Manufacturing",
        subtitle: "Excellence in Every Sheet",
        description:
            "Leading the industry with sustainable practices and innovative paper solutions for over three decades.",
        image: "/placeholder.svg?height=800&width=1200",
        products: [
            {
                id: 1,
                image: "/placeholder.svg?height=400&width=300",
                color: "#27ae60",
                title: "Creative Classic A4",
                specs: "80gsm",
                offset: { x: 0, y: 0, z: 5, rotate: 0 },
            },
            {
                id: 2,
                image: "/placeholder.svg?height=400&width=300",
                color: "#2980b9",
                title: "Creative Classic A4",
                specs: "70gsm",
                offset: { x: 40, y: 10, z: 4, rotate: 2 },
            },
            {
                id: 3,
                image: "/placeholder.svg?height=400&width=300",
                color: "#ffffff",
                title: "Creative Classic A4",
                specs: "90gsm",
                offset: { x: 80, y: 20, z: 3, rotate: 4 },
            },
            {
                id: 4,
                image: "/placeholder.svg?height=400&width=300",
                color: "#f39c12",
                title: "Creative Classic A4",
                specs: "100gsm",
                offset: { x: 120, y: 30, z: 2, rotate: 6 },
            },
        ],
    },
    {
        id: 2,
        title: "Sustainable Innovation",
        subtitle: "Eco-Friendly Solutions",
        description: "Committed to environmental responsibility while delivering the highest quality paper products.",
        image: "/placeholder.svg?height=800&width=1200",
        products: [
            {
                id: 1,
                image: "/placeholder.svg?height=400&width=300",
                color: "#16a085",
                title: "EcoFriendly A4",
                specs: "75gsm",
                offset: { x: 0, y: 0, z: 5, rotate: 0 },
            },
            {
                id: 2,
                image: "/placeholder.svg?height=400&width=300",
                color: "#1abc9c",
                title: "Recycled A4",
                specs: "80gsm",
                offset: { x: 40, y: 10, z: 4, rotate: 2 },
            },
            {
                id: 3,
                image: "/placeholder.svg?height=400&width=300",
                color: "#2ecc71",
                title: "Green Series A4",
                specs: "70gsm",
                offset: { x: 80, y: 20, z: 3, rotate: 4 },
            },
        ],
    },
    {
        id: 3,
        title: "Global Distribution",
        subtitle: "Worldwide Excellence",
        description: "Serving customers across continents with reliable supply chains and consistent quality.",
        image: "/placeholder.svg?height=800&width=1200",
        products: [
            {
                id: 1,
                image: "/placeholder.svg?height=400&width=300",
                color: "#e74c3c",
                title: "Premium Export A4",
                specs: "90gsm",
                offset: { x: 0, y: 0, z: 5, rotate: 0 },
            },
            {
                id: 2,
                image: "/placeholder.svg?height=400&width=300",
                color: "#3498db",
                title: "Office Pro A4",
                specs: "80gsm",
                offset: { x: 40, y: 10, z: 4, rotate: 2 },
            },
            {
                id: 3,
                image: "/placeholder.svg?height=400&width=300",
                color: "#f1c40f",
                title: "Creative Gold A4",
                specs: "100gsm",
                offset: { x: 80, y: 20, z: 3, rotate: 4 },
            },
            {
                id: 4,
                image: "/placeholder.svg?height=400&width=300",
                color: "#9b59b6",
                title: "Creative Premium A4",
                specs: "120gsm",
                offset: { x: 120, y: 30, z: 2, rotate: 6 },
            },
        ],
    },
]

const floatingElements = [
    { id: 1, size: 60, delay: 0 },
    { id: 2, size: 40, delay: 0.5 },
    { id: 3, size: 80, delay: 1 },
    { id: 4, size: 30, delay: 1.5 },
]

export default function Banner() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const { scrollY } = useScroll()

    const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
    const overlayY = useTransform(scrollY, [0, 500], [0, -100])
    const textY = useTransform(scrollY, [0, 500], [0, 200])

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
        setIsAutoPlaying(false)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
        setIsAutoPlaying(false)
    }

    return (
        <div className="relative bg-gray-900 py-32 h-auto overflow-hidden">
            {/* Background Images with Parallax */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bg-${currentSlide}`}
                    initial={{ scale: 1.1, opacity: 0, y: -1000 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -1000 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{ y: backgroundY }}
                >
                    <div
                        className="bg-cover bg-no-repeat bg-center w-full h-full"
                        style={{ backgroundImage: `url(${bannerSlides[currentSlide].image})` }}
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
                        {bannerSlides[currentSlide].products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className="relative flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div
                                    className="rounded-sm w-24 h-32"
                                    style={{
                                        backgroundColor: product.color,
                                        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <div className="flex flex-col justify-between items-center p-2 h-full text-center">
                                        <div className="font-bold text-white text-xs">Creative</div>
                                        <div className="font-bold text-white text-xl">A4</div>
                                        <div className="font-bold text-white text-xs">{product.specs}</div>
                                    </div>
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
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <motion.h3
                                        className="mb-4 font-medium text-orange-400 text-lg"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                    >
                                        {bannerSlides[currentSlide].subtitle}
                                    </motion.h3>

                                    <motion.h1
                                        className="mb-6 font-bold text-white text-5xl md:text-7xl leading-tight"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                    >
                                        {bannerSlides[currentSlide].title}
                                    </motion.h1>

                                    <motion.p
                                        className="mb-8 text-white/80 text-xl leading-relaxed"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                    >
                                        {bannerSlides[currentSlide].description}
                                    </motion.p>

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
                                transition={{ duration: 0.8 }}
                                className="hidden md:block"
                                style={{ perspective: "1000px" }}
                            >
                                <div className="relative" style={{ transformStyle: "preserve-3d", width: "350px", height: "420px" }}>
                                    {bannerSlides[currentSlide].products.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            className="absolute origin-center"
                                            initial={{
                                                opacity: 0,
                                                x: product.offset.x + 50,
                                                y: product.offset.y + 50,
                                                rotateY: product.offset.rotate + 15,
                                                scale: 0.8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: product.offset.x,
                                                y: product.offset.y,
                                                rotateY: product.offset.rotate,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0, x: product.offset.x + 500,
                                                y: product.offset.y + 50,
                                                rotateY: product.offset.rotate + 150,
                                                scale: 0.8,
                                            }}
                                            transition={{
                                                delay: index * 0.2,
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
                                                zIndex: bannerSlides[currentSlide].products.length * index,
                                                filter: "drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.3))",
                                            }}
                                        >
                                            {/* Paper Package */}
                                            <div className="relative w-75 h-96 cursor-pointer">
                                                <Image src={'/32432.png'} alt="" fill />
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
                    {bannerSlides.map((_, index) => (
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

// Helper function to adjust color brightness
function adjustBrightness(hex: string, percent: number) {
    // Convert hex to RGB
    let r = Number.parseInt(hex.substring(1, 3), 16)
    let g = Number.parseInt(hex.substring(3, 5), 16)
    let b = Number.parseInt(hex.substring(5, 7), 16)

    // Adjust brightness
    r = Math.max(0, Math.min(255, r + percent))
    g = Math.max(0, Math.min(255, g + percent))
    b = Math.max(0, Math.min(255, b + percent))

    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
