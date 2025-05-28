import BannerItem from '@/components/common/banner-item';
import SwiperWrapper from "@/components/common/swiper-wrapper";
import { Autoplay, Navigation } from 'swiper/modules';

type TProps = {
    data: BannersSection[] | undefined
}

export default function MainBanner({ data }: TProps) {
    return (
        <section id='home'>
            <SwiperWrapper
                navigation
                modules={[Navigation, Autoplay]}
                items={data?.map((item: BannersSection, idx) => <BannerItem item={item} key={idx} />)}

            />
        </section>
    )
}
