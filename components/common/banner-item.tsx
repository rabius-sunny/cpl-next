'use client'
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import Image from 'next/image';


type TProps = {
    item: SliderItem
}

export default function BannerItem({ item }: TProps) {
    const [firstWord, ...rest] = item?.title?.split(" ")!;
    return (
        <div
            className={cn(
                'flex items-center bg-cover bg-no-repeat bg-center py-20 w-full h-screen lg:h-[70vh]'
            )}
            style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0)), url(${item?.backgroundImage?.file})`
            }}
        >
            <div className='mx-auto px-4 container'>
                <div className="flex justify-between items-center w-full">
                    <div className='md:space-y-4 max-w-xl font-raleway'>
                        <motion.h2
                            initial={{ x: -30, y: -5, opacity: 0 }}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            exit={{ x: -30, y: -5, opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className='font-bold text-gray-900 text-4xl lg:text-6xl leading-tight'
                        >
                            {firstWord} <br />
                            {rest}
                        </motion.h2>
                        <motion.h4 initial={{ x: -30, y: -5, opacity: 0 }}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            exit={{ x: -30, y: -5, opacity: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className='text-gray-400 text-4xl leading-tight'
                        >
                            {item?.subtitle}
                        </motion.h4>
                        {/* <p className='font-light text-lg'>{item?.description}</p> */}
                        {/* <button onClick={onOpen} className="bg-white hover:bg-white px-6 py-3 rounded-lg text-gray-800 text-lg cursor-pointer">Products</button> */}
                    </div>

                    <div className="flex justify-center items-center w-full h-full">
                        <div className="">
                            {item?.images?.map((data) =>
                                data?.file && <Image src={data?.file} height={400} width={400} alt={data.fileId || ''} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
