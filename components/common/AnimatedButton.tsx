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
            className={cn("relative bg-primary inline-block focus:outline-none font-semibold text-white overflow-hidden rounded-lg", className)}
        >
            {/* Angled sliding background */}
            <AnimatePresence>
                {isHovering && (
                    <motion.span
                        key="hover-bg"
                        initial={{
                            x: direction === 'left' ? '-100%' : '100%',
                        }}
                        animate={{ x: 0 }}
                        exit={{
                            x: direction === 'left' ? '-100%' : '100%',
                        }}
                        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                        className="z-0 absolute inset-0 bg-secondary rounded-lg"
                    />
                )}
            </AnimatePresence>

            {/* Foreground content */}
            <motion.div
                initial={{
                    x: direction === 'left' ? '-100%' : '100%',
                }}
                animate={{ x: 0 }}
                exit={{
                    x: direction === 'left' ? '-100%' : '100%',
                }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                whileTap={{ scale: 0.95 }}
                // transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="z-10 relative px-10 py-3 w-full h-full"
            >
                {children}
            </motion.div>
        </motion.a>
    )
}


export default AnimatedButton