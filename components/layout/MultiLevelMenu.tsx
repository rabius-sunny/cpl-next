'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, Menu, Minus, Plus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'


function DesktopDropdown({ item, level = 0 }: { item: NavItem; level?: number }) {
    const [open, setOpen] = useState(false)
    const hasChildren = !!item.childrens?.length
    const pathname = usePathname()

    const positionClass =
        level === 0
            ? 'top-full left-0 mt-2'
            : 'top-0 left-full ml-2'

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {item.link ? (
                <Link
                    href={item.link}
                    className={cn("py-4 flex whitespace-nowrap mx-3 gap-2 group before:h-0.5 before:left-0 before:w-0 hover:before:w-full before:transform-3d before:transition-all before:duration-500 before:ease-in-out before:bg-secondary relative before:absolute before:bottom-0 uppercase text-xs font-medium", { "before:w-full": pathname === item?.link })}
                >
                    {item.title}
                    {hasChildren && (
                        <ChevronDown
                            size={18}
                            className="text-gray-500 group-hover:-rotate-180 transition-transform duration-500"
                        />
                    )}
                </Link>
            ) : (
                <div className="block hover:bg-gray-100 px-4 py-2 whitespace-nowrap cursor-default">
                    {item.title}
                </div>
            )}

            {hasChildren && (
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute ${positionClass} shadow w-52 z-50 p-4 bg-accent-foreground text-white`}
                        >
                            {item.childrens!.map((child, i) => (
                                <DesktopDropdown key={i} item={child} level={level + 1} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

export function MobileMenuItem({ item, level = 0 }: { item: NavItem; level?: number }) {
    const [open, setOpen] = useState(false)
    const hasChildren = !!item.childrens?.length
    const pathname = usePathname()
    return (
        <div className="relative w-full">
            <div className={`flex justify-between items-center px-4 py-2 overflow-hidden text-gray-800 font-medium ${level > 0 ? 'pl-6' : ''}`}
                onClick={() => setOpen((o) => !o)}
            >
                {item.link ? (
                    <Link href={item.link} className={cn({ 'text-primary': pathname === item.link })}>
                        {item.title}
                    </Link>
                ) : (
                    <span>{item.title}</span>
                )}
                {hasChildren && (
                    <button className='cursor-pointer'>
                        {open ? <Minus size={20} /> : <Plus size={20} />}
                    </button>
                )}
            </div>

            {
                hasChildren && (
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                {item.childrens!.map((child, idx) => (
                                    <MobileMenuItem key={idx} item={child} level={level + 1} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )
            }
        </div >
    )
}

export default function ResponsiveMenu({ items }: { items: NavItem[] }) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <nav className="z-50 relative">
            {/* Desktop Menu */}
            <ul className="hidden md:inline-flex">
                {items.map((item, index) => (
                    <li key={index} className="relative">
                        <DesktopDropdown item={item} />
                    </li>
                ))}
            </ul>

            {/* Mobile Toggle */}
            <div className="md:hidden flex justify-between items-center">
                <span className="font-semibold text-lg">Menu</span>
                <button onClick={() => setMobileOpen((o) => !o)}>
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden bg-white shadow border-b"
                    >
                        {items.map((item, index) => (
                            <MobileMenuItem key={index} item={item} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
