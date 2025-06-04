'use client'
import { cn } from '@/lib/utils'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

type TProps = {
  slides: any[]
  thumbs?: string[]
}

export const Thumb = ({
  item,
  selected,
  onClick
}: {
  item: any
  selected: boolean
  onClick: () => void
}) => {
  return (
    <div
      className={' embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected cursor-pointer' : ''
      )}
      onClick={onClick}
    >
      <Image
        src={item || '/placeholder.webp'}
        alt='Thumbnail'
        width={125}
        height={125}
        className={cn('w-full object-cover aspect-square', { '': selected })}
      />
    </div>
  )
}

const EmblaCarousel: React.FC<TProps> = (props) => {
  const { slides, thumbs } = props
  const [axis, setAxis] = useState<'x' | 'y'>('x')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel()
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    axis: axis
  })

  // Change axis on resize
  useEffect(() => {
    const updateAxis = () => {
      setAxis(window.innerWidth < 1024 ? 'x' : 'y')
    }

    updateAxis() // Initial check
    window.addEventListener('resize', updateAxis)

    return () => window.removeEventListener('resize', updateAxis)
  }, [])

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className='flex lg:flex-row flex-col justify-center items-center gap-8 lg:gap-12 embla'>
      <div className='w-full embla__viewport' ref={emblaMainRef}>
        <div className='embla__container'>
          {slides.map((item, idx) => (
            <div className='embla__slide' key={idx}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {thumbs && thumbs.length ? (
        <div className='embla-thumbs'>
          <div className='embla-thumbs__viewport' ref={emblaThumbsRef}>
            <div className='flex flex-row lg:flex-col justify-center gap-6 embla-thumbs__container'>
              {thumbs.map((item, index) => (
                <Thumb
                  key={index}
                  item={item}
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default EmblaCarousel
