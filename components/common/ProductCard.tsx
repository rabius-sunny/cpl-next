import Image from "next/image";
import Link from "next/link";

type TProps = {
    item: Product
}

export default function ProductCard({ item }: TProps) {
    return (
        <div>
            <Image src={item.thumbnail?.file || ''} height={400} width={400} alt="" />
            <div id="description" className="space-y-4 bg-secondary p-5">
                <h4 className="font-semibold text-lg">{item?.name}</h4>
                <p className="">{item?.description}</p>
                <Link href={'/#'}>See more</Link>
            </div>
        </div>
    )
}
