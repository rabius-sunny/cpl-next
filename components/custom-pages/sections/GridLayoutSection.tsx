import Image from 'next/image'

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
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center'>
            {title}
          </h2>
        )}

        <div className={`grid ${getGridCols(columns)} gap-8`}>
          {items.map((item, index) => (
            <div key={item.id || index} className='grid gap-2'>
              {item.image?.file && (
                <div className='flex justify-center items-center size-full'>
                  <Image
                    src={item.image.file || '/placeholder.webp'}
                    alt={item.title || `Grid item ${index + 1}`}
                    width={250}
                    height={250}
                    className='rounded-full size-36 lg:size-40  overflow-hidden shadow-lg'
                  />
                </div>
              )}

              <div className='p-6'>
                {item.title && (
                  <h3 className='text-lg text-center font-bold text-gray-900 mb-3'>{item.title}</h3>
                )}
                {item.description && (
                  <p className='text-gray-600 text-center leading-relaxed'>{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No items to display</p>
          </div>
        )}
      </div>
    </section>
  )
}
