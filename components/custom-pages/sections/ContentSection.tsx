'use client'

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface ContentSectionProps {
  data: ContentSection
}

export default function ContentSection({ data }: ContentSectionProps) {
  return (
    <section className={cn(data.content ? 'py-16 bg-white' : 'py-10 bg-white')}>
      <div className='box'>
        {data.title && (
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='mb-8 font-bold text-primary text-3xl md:text-5xl xl:text-6xl text-center'
          >
            {data.title}
          </motion.h2>
        )}
        {data.content && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='space-y-4 max-w-none text-gray-700 text-wrap leading-relaxed whitespace-pre-wrap prose prose-lg'
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        )}
      </div>
    </section>
  )
}
