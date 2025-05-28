import SwiperWrapper from "@/components/common/swiper-wrapper";
import { Navigation } from 'swiper/modules';
import { SectionHeading } from "../common";
import ProjectItem from "../common/project-item";

type TProps = {
    data: Projects | undefined
}

export default function ({ data = { title: '', subtitle: '', items: [] } }: TProps) {
    const { title, subtitle, items } = data

    return (
        <section className="py-20" id="projects">
            <div className="space-y-10 mx-auto px-4 container">
                <SectionHeading title={title} subtitle={subtitle} />

                <SwiperWrapper
                    navigation
                    spaceBetween={16}
                    slidesPerView={2}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 15,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 30,
                        },
                    }}
                    modules={[Navigation]}
                    items={items?.map((item: ProjectItem, idx) => <ProjectItem item={item} key={idx} />)}
                />
            </div>
        </section>
    )
}
