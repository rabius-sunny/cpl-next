import { cn } from "@/lib/utils"

type TProps = {
    title?: string
    subtitle?: string
    className?: string
}

export default function SectionHeading({ title, subtitle, className }: TProps) {
    return (
        <div className={cn("space-y-3 max-w-4xl", className)}>
            <h1 className="before:bottom-0 before:left-1/2 before:absolute relative before:bg-primary pb-4 before:rounded-full before:w-16 before:h-1 font-raleway font-bold text-primary text-3xl lg:text-5xl before:-translate-x-1/2">{title}</h1>
            {subtitle && <p className="font-roboto font-thin text-2xl lg:text-4xl leading-snug">{subtitle}</p>}
        </div>
    )
}
