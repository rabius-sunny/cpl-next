import { cn } from "@/lib/utils";

type TPops = {
    data?: string
}


export default function VideoSection({ data }: TPops) {
    if (!data) return null
    console.log('data :>> ', data);
    return (
        <section id="video" className={cn("py-16")}>
            <div className="mx-auto px-4 max-w-7xl container">
                <div className="flex flex-col justify-center items-center gap-6">
                    <iframe
                        src={data?.replace('https://youtu.be/', 'https://www.youtube.com/embed/')?.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"
                        className="w-full aspect-video"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    )
}
