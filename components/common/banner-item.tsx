'use client'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import HeroItem from "../details/HeroItem"
import ModalWrapper from './ModalWrapper'


type TProps = {
    item: BannersSection
}

export default function BannerItem({ item }: TProps) {
    const [open, setOpen] = useState(false);

    const onOpen = () => {
        setOpen(true);
    }
    const onClose = () => {
        setOpen(false);
    }

    return (
        <>
            <div
                className={cn(
                    'flex items-center bg-cover bg-no-repeat bg-center py-20 w-full h-screen lg:h-[70vh]'
                )}
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0)), url(${item?.image?.file})`
                }}
            >
                <div className='mx-auto px-4 container'>
                    <div className='space-y-4 md:space-y-6 max-w-2xl text-white'>
                        <h4 className='text-2xl'>{item?.subTitle}</h4>
                        <h2 className='font-medium text-4xl lg:text-5xl leading-tight'>{item?.title}</h2>
                        <p className='font-light text-lg'>{item?.description}</p>
                        <button onClick={onOpen} className="bg-white hover:bg-white px-6 py-3 rounded-lg text-gray-800 text-lg cursor-pointer">Products</button>
                    </div>
                </div>
            </div>

            {item?.product && (
                <ModalWrapper open={open} onOpen={onClose}>
                    <HeroItem item={item?.product} />
                </ModalWrapper>
            )}

        </>

    )
}
