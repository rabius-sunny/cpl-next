'use client'

import { motion } from 'motion/react'

export default function AnimatedButton({
    children,
    href,
}: {
    children: React.ReactNode
    href?: string
}) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:shadow-lg px-6 py-3 rounded-full focus:outline-none font-semibold text-white"
        >
            {children}
        </motion.a>
    )
}
