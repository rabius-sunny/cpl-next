import { cn } from "@/lib/utils";
import Image from "next/image";
import { AnimatedCounter } from "../common/CounterStats";

type TPops = {
    data?: StatsSection
}


export default function ProductsSection({ data }: TPops) {
    const [firstWord, ...rest] = (data?.title || '').split(" ");

    return (
        <section id="about_us" className={cn("py-20 bg-white")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex flex-col justify-center items-center gap-12">
                    {/* <SectionHeading title={data?.title} /> */}
                    <h2 className='font-bold text-5xl'>{firstWord} <span className='text-secondary'>{rest}</span></h2>
                    {data?.backgroundImage?.file && <Image src={data?.backgroundImage?.file} width={1920} height={1200} alt="" />}

                    <div className="flex lg:flex-row flex-col gap-6 shadow-gray-200 shadow-md rounded-xl w-full">
                        {data?.stats?.map((data, index) => (
                            <div className="flex flex-col justify-center items-center gap-4 px-6 py-10 text-center basis-full lg:basis-1/3" key={index}>
                                <AnimatedCounter to={data?.count ?? 0} className='font-black text-secondary text-7xl lg:text-9xl' />
                                <h2 className="font-bold text-secondary lg:text-xl uppercase">{data?.title}</h2>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
