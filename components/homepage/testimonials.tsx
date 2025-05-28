import { cn } from "@/lib/utils"
import Image from "next/image"
import { TestimonialCarousel } from "../common/TestimonialCarousel"

type TProps = {
    data: TestimonialsSection | undefined
}

export const TestimonialSection = ({ data }: TProps) => {

    return (
        <section id="about_us" className={cn("py-20")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex flex-row justify-between items-center gap-20 w-full">
                    <div className="hidden xl:block relative w-64">
                        <div className="relative size-fit">
                            <Image src={'/images/testimonial.jpg'} alt="" height={386} width={198} />

                            <div className="inline-flex top-1/6 right-0 absolute justify-center items-center bg-secondary p-2 w-14 h-24 text-white text-8xl leading-20 translate-x-1/2">
                                <span className="bottom-5 absolute bg-amber-600 leading-0">&ldquo;</span>
                            </div>
                        </div>
                    </div>
                    <TestimonialCarousel data={data} />
                </div>
            </div>
        </section>
    )
}
