import { cn } from "@/lib/utils";
import Image from "next/image";

type TPops = {
    data?: StatsSection
}


export default function StatisticsSection({ data }: TPops) {
    const [firstWord, ...rest] = (data?.title || '').split(" ");
    return (
        <section id="about_us" className={cn("py-20 bg-white")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex flex-col justify-center items-center gap-12">
                    {/* <SectionHeading title={data?.title} /> */}
                    <h2 className='font-bold text-5xl'>{firstWord} <span className='text-secondary'>{rest}</span></h2>
                    {data?.backgroundImage?.file && <Image src={data?.backgroundImage?.file} width={1920} height={1200} alt="" />}
                </div>
            </div>
        </section>
    )
}
