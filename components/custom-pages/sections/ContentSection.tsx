import { cn } from '@/lib/utils'

interface ContentSectionProps {
  data: ContentSection
}

export default function ContentSection({ data }: ContentSectionProps) {
  return (
    <section className={cn(data.content ? 'py-16 bg-white' : 'py-10 bg-white')}>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          {data.title && (
            <h2 className='text-3xl md:text-5xl xl:text-6xl font-bold text-primary mb-8 text-center'>
              {data.title}
            </h2>
          )}
          {data.content && (
            <div
              className='prose prose-lg max-w-none text-gray-700 leading-relaxed'
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
