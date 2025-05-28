import { cn } from "@/lib/utils"

type TProps = {
    title?: string
    subtitle?: string
    className?: string
}

export default function SectionHeading({ title, subtitle, className }: TProps) {
    return (
        <div className={cn("space-y-3 max-w-4xl", className)}>
            <h1 className="font-poppins font-light text-4xl lg:text-6xl">{title}</h1>
            {subtitle && <p className="font-poppins font-thin text-2xl lg:text-4xl leading-snug">{subtitle}</p>}
        </div>
    )
}
