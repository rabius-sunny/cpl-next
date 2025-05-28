'use client'
import { cn } from '@/lib/utils'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

export function AnimatedCounter({ to, className }: { to: number, className?: string }) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Number(latest.toFixed(1)))
    const ref = useRef<HTMLElement | null>(null)
    const [inViewRef, inView] = useInView({ triggerOnce: true })

    // Merge refs
    function setRefs(el: HTMLElement | null) {
        ref.current = el
        inViewRef(el)
    }

    useEffect(() => {
        if (inView) {
            animate(count, to, { duration: 2, ease: 'easeOut' })
        }
    }, [inView, count, to])

    return (
        <motion.span ref={setRefs} className={cn(className)}>
            {rounded}
        </motion.span>
    )
}
