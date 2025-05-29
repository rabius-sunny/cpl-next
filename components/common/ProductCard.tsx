'use client'
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

type TProps = {
    item: Product
}

export default function ProductCard({ item }: TProps) {
    return (
        <motion.div
            className="group relative bg-white shadow-md pb-20 w-full h-[400px] overflow-hidden"
            initial="rest"
            whileHover="hover"
            animate="rest"
        >
            {/* Background Image with Zoom */}
            <motion.div
                className="relative flex justify-center items-center size-full"
                variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.05 },
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                <Image
                    src={item.thumbnail?.file || ''}
                    alt="product"
                    height={320}
                    width={320}
                    className="object-cover"
                />
            </motion.div>

            {/* Animated Description Box */}
            <motion.div
                className="right-0 bottom-0 left-0 z-10 absolute space-y-6 bg-secondary/95 group-hover:bg-gray-950/90 px-6 py-6 transition-colors duration-500 ease-in-out"
                variants={{
                    rest: { height: 80 },
                    hover: { height: 200 },
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <motion.h4
                    className="font-semibold text-white text-lg line-clamp-1"
                    variants={{
                        rest: { opacity: 1, y: 0 },
                        hover: { opacity: 1, y: 0 },
                    }}
                >
                    {item?.name}
                </motion.h4>

                <motion.p
                    className="text-white"
                    variants={{
                        rest: { opacity: 0, y: 10 },
                        hover: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {item?.description?.split('.')[0]}
                </motion.p>

                <motion.div
                    variants={{
                        rest: { opacity: 0 },
                        hover: { opacity: 1 },
                    }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/#" className="block font-extrabold text-secondary">
                        See more
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
