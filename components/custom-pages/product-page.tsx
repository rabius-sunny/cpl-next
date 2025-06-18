'use client'

import EmblaCarousel from "@/components/common/EmblaCarousel";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

type TProps = {
    data: any
}

export default function ProductPage({ data }: TProps) {
    const fadeSlide = (dir: 'left' | 'right') => ({
        initial: { opacity: 0, x: dir === 'left' ? -60 : 60 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
        viewport: { once: true, amount: 0.4 },
    })
    return (
        <section id="about_us" className={cn("py-20")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex lg:flex-row flex-col items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <motion.div
                        {...fadeSlide('left')}
                        className="space-y-8 w-full lg:w-1/2"
                    >
                        <h1 className="font-bold text-gray-700 text-3xl lg:text-6xl">
                            {data?.name}
                        </h1>
                        <p className="text-base leading-loose">{data?.description}</p>

                        <div className="space-y-2">
                            {data?.features?.map(
                                (feature: { key: string; value: string }, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx, duration: 0.4 }}
                                        viewport={{ once: true }}
                                        className="space-x-2"
                                    >
                                        <span className="font-semibold">{feature?.key}:</span>
                                        <span>{feature?.value}</span>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.div>

                    {/* Carousel */}
                    <motion.div
                        {...fadeSlide('right')}
                        className="order-first lg:order-0 w-full lg:w-1/2"
                    >
                        <EmblaCarousel
                            thumbs={data?.images?.map(
                                (item: MediaFile) => item?.file || '/placeholder.webp'
                            )}
                            slides={data?.images?.map((item: MediaFile, idx: number) => (
                                <div key={idx} className="relative w-full aspect-square overflow-hidden">
                                    <Image
                                        src={item?.file || '/placeholder.webp'}
                                        fill
                                        alt=""
                                        className="relative size-full object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            ))}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
