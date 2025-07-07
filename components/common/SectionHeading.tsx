import { cn } from "@/lib/utils"

type TProps = {
    title?: string
    subtitle?: string
    className?: string
}

export default function SectionHeading({ title, subtitle, className }: TProps) {
    return (
        <div className={cn("space-y-3 max-w-4xl", className)}>
            <h1 className="font-raleway font-bold text-primary text-3xl lg:text-5xl">{title}</h1>
            {subtitle && <p className="font-roboto font-thin text-2xl lg:text-4xl leading-snug">{subtitle}</p>}
        </div>
    )
}
