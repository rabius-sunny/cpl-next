'use client'

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

const AnimatedButton = ({
    href,
    children,
    className,
}: {
    href: string
    children: React.ReactNode
    className?: string
}) => {
    const [direction, setDirection] = useState<'left' | 'right'>('left')
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseEnter = (e: React.MouseEvent) => {
        const { left, width } = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - left
        setDirection(x < width / 2 ? 'left' : 'right')
        setIsHovering(true)
    }

    const handleMouseLeave = () => setIsHovering(false)

    return (
        <motion.a
            href={href}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative bg-primary inline-block focus:outline-none font-semibold text-white overflow-hidden",
                className
            )}
        >
            {/* Base content layer with sliding exit */}
            <motion.div
                className="relative px-10 py-3"
                animate={{
                    x: isHovering ? (direction === 'left' ? '-100%' : '100%') : 0,
                    opacity: isHovering ? 0 : 1
                }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
                {children}
            </motion.div>

            {/* Hover effect layer - slides in from opposite direction */}
            <AnimatePresence mode="wait">
                {isHovering && (
                    <motion.div
                        className="absolute inset-0 bg-secondary"
                        initial={{
                            x: direction === 'left' ? '100%' : '-100%'
                        }}
                        animate={{
                            x: 0
                        }}
                        exit={{
                            x: direction === 'left' ? '100%' : '-100%'
                        }}
                        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                    >
                        <div className="flex justify-center items-center px-10 py-3 w-full h-full">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.a>
    )
}

export default AnimatedButton