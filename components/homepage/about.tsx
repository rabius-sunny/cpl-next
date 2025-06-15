import { cn } from "@/lib/utils"
import SectionHeading from "../common/SectionHeading"

type TPops = {
    data?: AboutSection
}


export default function AboutSection({ data }: TPops) {
    return (
        <section id="about_us" className={cn("py-8 lg:py-16")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex flex-col justify-center items-center gap-6">
                    <SectionHeading title={data?.title} />
                    <p className="font-normal text-gray-600 text-base text-justify leading-loose">{data?.description}</p>
                </div>
            </div>
        </section>
    )
}
