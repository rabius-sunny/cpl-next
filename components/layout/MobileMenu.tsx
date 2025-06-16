'use client'
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { MobileMenuItem } from "./MultiLevelMenu";

type TProps = {
    items?: any
}

export default function MobileMenu({ items }: TProps) {
    const [open, setOpen] = useState<boolean>(false)
    const pathname = usePathname()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger onClick={() => setOpen(true)}>
                <span className="group lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 border border-transparent rounded-md focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 font-medium text-white text-sm cursor-pointer">
                    <span className="bg-gray-800 w-6 h-[3px]" />
                    <span className="bg-gray-800 w-6 h-[3px] transition-all duration-300 ease-in-out transform" />
                    <span className="bg-gray-800 w-6 h-[3px]" />
                </span>
            </SheetTrigger>
            <SheetContent className="bg-white border-none! w-[85%] max-w-sm">
                <SheetHeader>
                    <SheetTitle className=''>Menu</SheetTitle>
                    <SheetClose />
                </SheetHeader>


                <SheetDescription asChild>
                    <div className="relative pb-20 max-w-full overflow-y-auto">
                        {items?.map((item: NavItem, index: number) => (
                            <MobileMenuItem key={index} item={item} />
                        ))}
                    </div>
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}
