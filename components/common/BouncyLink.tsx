'use client';

import { HTMLMotionProps, motion } from 'motion/react';
import Link from 'next/link';

import type { ReactNode } from 'react';

interface BouncyLinkProps extends HTMLMotionProps<'a'> {
    href: string;
    children: ReactNode;
}

const MotionLink = motion.a; // motion-enhanced anchor tag

const BouncyLink = ({ href, children, className, ...rest }: BouncyLinkProps) => (
    <Link href={href} passHref prefetch={false}>
        <MotionLink
            {...rest}
            href={href}
            className={`relative inline-block ${className}`}
            initial={{ y: 0 }}
            whileHover={{
                y: [0, -12, 0, -6, 0, -2, 0],
                transition: {
                    duration: 1.2,
                    delay: 0.3,
                    ease: 'easeOut',
                },
            }}
        >

            {children}
        </MotionLink>
    </Link>
);

export default BouncyLink;
