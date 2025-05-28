import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import SwiperWrapper from "../common/swiper-wrapper";

export default function ServiceItem({ item }: { item: ServiceItem }) {
    return (
        <div className='items-center gap-4 grid grid-cols-none xl:grid-cols-3 h-fit'>
            <div className="space-y-6 lg:col-span-2">
                <h2 className='font-medium text-primary text-3xl uppercase'>{item.subTitle}</h2>
                <p className='font-light text-wrap whitespace-pre-wrap'>{item.description}</p>
                {item?.link && <Link href={item?.link} prefetch={false} target="_blank" className='text-xl'>Read More</Link>}
            </div>
            <div className="relative w-full max-w-full max-h-fit overflow-hidden">
                <SwiperWrapper
                    navigation
                    modules={[Navigation, Autoplay]}
                    items={item?.images?.map((image: MediaFile, idx) => (
                        <div key={idx} className="relative size-full">
                            <Image src={image.file || ''} height={800} width={500} alt="" className="w-full h-[500px] object-cover" key={idx} />
                        </div>
                    ))}
                />
            </div>
        </div>
    )
}
