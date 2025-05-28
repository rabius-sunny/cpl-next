'use client'
import { motion, useInView } from 'motion/react'
import React, { useRef } from 'react'
type FadeUpProps = {
    children: React.ReactNode
    className?: string
    duration?: number
    delay?: number
    ease?: 'easeIn' | 'easeOut' | 'easeInOut' | number[]
    yOffset?: number
}
const FadeUp = ({
    children,
    className,
    duration = 0.5,
    delay = 0,
    ease = 'easeOut',
    yOffset = 20,
}: FadeUpProps) => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: false, amount: 0.3 })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: yOffset }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
            transition={{ duration, delay, ease }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
export default FadeUp