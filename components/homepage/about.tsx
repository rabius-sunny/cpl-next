'use client'
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { SectionHeading } from "../common";
import ModalWrapper from "../common/ModalWrapper";
import SwiperWrapper from "../common/swiper-wrapper";

type TProps = {
    data: AboutSection | undefined
}

export default function AboutSection({ data = {} }: TProps) {
    const { title, subtitle, stats, description } = data
    const [open, setOpen] = useState(false);

    const onOpen = () => {
        setOpen(true);
    }
    const onClose = () => {
        setOpen(false);
    }

    return (
        <section id="about_us" className={cn("py-30 bg-gray-50")}>
            <div className="mx-auto px-4 container">
                <div className="flex lg:flex-row flex-col justify-center items-center gap-16 pb-2 lg:text-start">
                    <div className="w-full lg:w-2/3">
                        <div className="space-y-6 max-w-3xl">
                            <SectionHeading title={title} subtitle={subtitle} />

                            <p className="font-poppins font-light text-gray-800 text-lg whitespace-pre-wrap">{description}</p>
                            <div className="flex justify-start items-center mt-8 divide-x-2">
                                {stats?.map((data, idx) =>
                                    <div className="flex flex-col items-center space-y-3 px-6 md:px-10 py-4 text-center" key={idx}>
                                        <span className="text-xl">{data?.title}</span>
                                        <span className="font-medium text-secondary-foreground text-4xl">{data?.count}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-6 w-full lg:w-1/3 overflow-hidden">
                        <div className="relative shadow-lg rounded-lg w-full max-w-full">
                            <SwiperWrapper
                                navigation
                                modules={[Navigation, Autoplay]}
                                items={data?.images?.map((image: MediaFile, idx: number) => (
                                    <div key={idx} className="relative size-full">
                                        <Image src={image.file || ''} height={800} width={500} alt="" className="w-full object-cover" key={idx} />
                                    </div>
                                ))}
                            />
                        </div>
                        <button
                            onClick={onOpen}
                            className="hover:bg-primary px-5 py-3 border hover:border-primary border-black rounded-md font-montserrat font-normal hover:text-white text-xl cursor-pointer">Who We Are</button>
                    </div>
                </div>
            </div>


            <ModalWrapper open={open} onOpen={onClose}>
                <div className="relative items-center gap-16 grid grid-cols-1 lg:grid-cols-3 pb-12 w-full max-w-full h-fit">
                    <div className="col-span-full">
                        <h2 className='mb-6 font-medium text-gray-800 text-2xl lg:text-4xl text-center'>Who We Are</h2>
                        <SwiperWrapper
                            navigation
                            spaceBetween={16}
                            slidesPerView={2}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                            }}
                            modules={[Navigation]}
                            items={data?.teamfirst?.map((team: any, idx: number) => (
                                <div key={idx} className="relative flex flex-col justify-center items-center gap-2 size-full overflow-hidden text-center">
                                    <div className="flex justify-center items-center border rounded-sm w-full lg:w-52 h-44 lg:h-56 overflow-hidden">
                                        <Image src={team.image.file || '/placeholder.webp'} height={400} width={300} alt={team?.name} className="h-full object-cover" key={idx} />
                                    </div>
                                    <p className="text-sm lg:text-base">{team?.name}</p>
                                    <p className="text-gray-500 lg:text-xl">{team?.designation}</p>
                                </div>
                            ))}
                        />
                    </div>

                    <div className="col-span-full">
                        <SwiperWrapper
                            navigation
                            spaceBetween={16}
                            slidesPerView={2}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                            }}
                            modules={[Navigation]}
                            items={data?.teamsecond?.map((team: any, idx: number) => (
                                <div key={idx} className="relative flex flex-col justify-center items-center gap-2 size-full overflow-hidden text-center">
                                    <div className="flex justify-center items-center border rounded-full size-full sm:size-44 lg:size-56 aspect-square overflow-hidden">
                                        <Image src={team.image.file || '/placeholder.webp'} height={300} width={300} alt={team?.name} className="h-full object-cover" key={idx} />
                                    </div>
                                    <p className="text-sm lg:text-base">{team?.name}</p>
                                    <p className="text-gray-500 lg:text-xl">{team?.designation}</p>
                                </div>
                            ))}
                        />
                    </div>


                </div>
            </ModalWrapper>
        </section>


    )
}
