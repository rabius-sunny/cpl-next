import { cn } from "@/lib/utils";
import Image from "next/image";
import { AnimatedCounter } from "../common/CounterStats";

type TPops = {
    data?: StatsSection
}


export default function StatisticsSection({ data }: TPops) {
    const [firstWord, ...rest] = (data?.title || '').split(" ");

    return (
        <section id="about_us" className={cn("py-16 bg-white")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex flex-col justify-center items-center gap-12">
                    {/* <SectionHeading title={data?.title} /> */}
                    <h2 className='font-bold text-3xl lg:text-5xl'>{firstWord} <span className='text-primary'>{rest}</span></h2>
                    {data?.backgroundImage?.file && <Image src={data?.backgroundImage?.file} width={1920} height={1200} alt="" />}

                    <div className="flex sm:flex-row flex-col gap-6 shadow-gray-200 shadow-md rounded-xl w-full">
                        {data?.stats?.map((data, index) => (
                            <div className="flex flex-col justify-center items-center gap-4 px-6 py-6 lg:py-10 text-center basis-full lg:basis-1/3" key={index}>
                                <AnimatedCounter to={data?.count ?? 0} className='font-black text-primary sm:text-6xl text-7xl lg:text-9xl' />
                                <h2 className="font-bold text-primary sm:text-sm lg:text-xl uppercase">{data?.title}</h2>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
