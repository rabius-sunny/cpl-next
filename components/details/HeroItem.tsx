import Image from "next/image";
import { Autoplay, Navigation } from "swiper/modules";
import SwiperWrapper from "../common/swiper-wrapper";

export default function HeroItem({ item }: { item: BannerProduct }) {
    return (
        <div className='items-center gap-4 grid grid-cols-none 2xl:grid-cols-3 h-fit'>
            <div className="lg:col-span-2">
                {/* Product description */}
                <p className='mb-3 font-light text-wrap whitespace-pre-wrap'>{item.description}</p>

                {/* Product features */}
                {item.features && item.features.length > 0 && (
                    <div className='space-y-2 my-6'>
                        <h4 className='text-gray-900'>Features:</h4>
                        <ul className='space-y-1'>
                            {item.features.map((feature, fidx) => (
                                <li key={fidx} className='flex'>
                                    <span className='mr-2 font-medium'>{feature.key}:</span>
                                    <span className=''>{feature.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="relative w-full max-w-lg max-h-fit overflow-hidden">
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
