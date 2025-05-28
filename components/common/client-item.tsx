import { cn } from "@/lib/utils";
import Image from "next/image";

type TProps = {
    item: {
        image?: MediaFile; link?: string
    }
}

export default function ClientItem({ item }: TProps) {
    if (!item?.image?.file) return null

    return (
        <div className={cn('flex flex-col items-center relative justify-center text-center gap-3 group bg-white rounded-md border-2 border-gray-300 aspect-square overflow-hidden max-w-xs')}>
            <Image
                fill
                src={item?.image?.file} alt={''}
                className="w-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out transform"
            />
        </div >
    )
}
