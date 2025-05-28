import SwiperWrapper from "@/components/common/swiper-wrapper";
import { Autoplay, Pagination } from 'swiper/modules';
import { SectionHeading } from "../common";
import ClientItem from "../common/client-item";

type TProps = {
    data: ClientsSection | undefined
}

export default function Clients({ data }: TProps) {

    return (
        <section className="bg-gray-50 py-20" id="our_clients">
            <div className="z-0 space-y-10 mx-auto px-4 container">
                <SectionHeading title={data?.title} className="mx-auto text-center" />

                <SwiperWrapper
                    navigation={false}
                    spaceBetween={16}
                    slidesPerView={3}
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        768: {
                            slidesPerView: 5,
                            spaceBetween: 25,
                        },
                        1024: {
                            slidesPerView: 7,
                            spaceBetween: 40,
                        },
                    }}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: true,
                        pauseOnMouseEnter: true,
                    }}
                    modules={[Pagination, Autoplay]}
                    items={data?.logos?.map((item: { image?: MediaFile; link?: string }, idx: number) => <ClientItem item={item} key={idx} />)}
                    className="!pb-14"
                />
            </div>
        </section>
    )
}
