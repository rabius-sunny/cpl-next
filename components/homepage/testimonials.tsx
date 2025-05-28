import { cn } from "@/lib/utils"
import { TestimonialCarousel } from "../common/TestimonialCarousel"

type TProps = {
    data: TestimonialsSection | undefined
}

export const TestimonialSection = ({ data }: TProps) => {

    return (
        <section id="about_us" className={cn("py-20 bg-gray-50")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex flex-col justify-center items-center gap-6">
                    <TestimonialCarousel data={data} />
                </div>
            </div>
        </section>
    )
}
