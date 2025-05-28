'use client';

import { ReactNode } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { SwiperProps } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

type SwiperWrapperProps = SwiperProps & {
    items?: ReactNode[]; // Optional array of slide content
    children?: ReactNode; // Or manual <SwiperSlide> usage
    className?: string;
};

export default function SwiperWrapper({
    items,
    children,
    className = '',
    onSwiper,
    ...props
}: SwiperWrapperProps) {
    return (
        <Swiper
            className={`mySwiper ${className}`}
            loop={true}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
            }}
            modules={[Navigation, Pagination, Autoplay]}
            onSwiper={onSwiper}
            {...props}
        >
            {items
                ? items.map((item, index) => (
                    <SwiperSlide key={index}>{item}</SwiperSlide>
                ))
                : children}
        </Swiper>
    );
}
