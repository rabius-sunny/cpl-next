import { cn } from "@/lib/utils"

type TPops = {
    data?: VideoSection
}


export default function VideoSection({ data }: TPops) {
    if (!data?.file) return null

    return (
        <section id="video" className={cn("py-20")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex flex-col justify-center items-center gap-6">
                    <video controls>
                        <source src={data?.file} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                </div>
            </div>
        </section>
    )
}
