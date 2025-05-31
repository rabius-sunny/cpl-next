interface ContentSectionProps {
  data: ContentSection
}

export default function ContentSection({ data }: ContentSectionProps) {
  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          {data.title && (
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center'>
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
