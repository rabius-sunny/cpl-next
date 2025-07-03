'use client'
import { motion } from 'motion/react';
import Image from 'next/image';

interface GridLayoutSectionProps {
  data: GridLayoutSection
}

export default function GridLayoutSection({ data }: GridLayoutSectionProps) {
  const { title, columns = 3, items = [] } = data

  // Determine grid columns based on the columns setting
  const getGridCols = (cols: number) => {
    switch (cols) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  return (
    <section className='py-16'>
      <div className='box'>
        {title && (
          <h2 className='mb-12 font-bold text-gray-900 text-3xl md:text-4xl text-center'>
            {title}
          </h2>
        )}

        <div className={`grid ${getGridCols(columns)} gap-8`}>
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              className='gap-2 grid'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {item.image?.file && (
                <div className='flex justify-center items-center size-full'>
                  <Image
                    src={item.image.file || '/placeholder.webp'}
                    alt={item.title || `Grid item ${index + 1}`}
                    width={250}
                    height={250}
                    className='shadow-lg rounded-full size-36 lg:size-40 overflow-hidden'
                  />
                </div>
              )}

              <div className='p-6'>
                {item.title && (
                  <h3 className='mb-3 font-bold text-gray-900 text-lg text-center'>{item.title}</h3>
                )}
                {item.description && (
                  <p className='text-gray-600 text-center leading-relaxed'>{item.description}</p>
                )}
              </div>
            </motion.div>
          ))}

        </div>

        {items.length === 0 && (
          <div className='py-12 text-center'>
            <p className='text-gray-500'>No items to display</p>
          </div>
        )}
      </div>
    </section>
  )
}
