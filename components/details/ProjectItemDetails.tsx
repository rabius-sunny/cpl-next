import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import SwiperWrapper from "../common/swiper-wrapper";

export default function ProjectItemDetails({ item }: { item: ProjectItem }) {
    return (
        <div className='items-center gap-8 grid grid-cols-1 lg:grid-cols-2 h-fit'>
            <div className="space-y-6">
                <h2 className='font-medium text-primary text-3xl uppercase'>{item.title}</h2>
                <p className='font-light text-wrap whitespace-pre-wrap'>{item.description}</p>
                {item?.link && <Link href={item?.link} prefetch={false} target="_blank" className='text-xl'>Read More</Link>}
            </div>
            <div className="relative w-full max-w-full max-h-fit overflow-hidden">
                <SwiperWrapper
                    navigation
                    modules={[Navigation, Autoplay]}
                    items={item?.images?.map((image: MediaFile, idx) => (
                        <div key={idx} className="relative rounded-2xl size-full overflow-hidden">
                            <Image src={image.file || ''} height={800} width={500} alt="" className="rounded-2xl w-full object-cover aspect-square" key={idx} />
                        </div>
                    ))}
                />
            </div>
        </div>
    )
}
