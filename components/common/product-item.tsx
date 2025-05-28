'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SwiperClass } from 'swiper/react'



import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import ModalWrapper from './ModalWrapper'
import SwiperWrapper from './swiper-wrapper'

type TProps = {
  item: ProductItem
}
export default function ProductItem({ item }: TProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [images, setImages] = useState<MediaFile[]>(item?.images || []);
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  }
  const onClose = () => {
    setOpen(false);
  }


  useEffect(() => {
    if (item?.images) {
      setImages(item?.images);
    }
  }, [item?.images]);


  return (
    <>
      <div className='group flex flex-col items-center gap-3 p-1 text-center cursor-pointer' onClick={onOpen}>
        <Image
          src={item?.icon?.file || '/placeholder.webp'}
          alt={item?.title}
          height={200}
          width={200}
          className='w-auto font-title text-lg group-hover:scale-110 transition-transform duration-300 ease-in-out transform'
        />

        <p className='font-title group-hover:font-semibold text-base lg:text-lg transition-all duration-300 ease-in-out transform'>
          {item?.title}
        </p>
      </div>

      <ModalWrapper open={open} onOpen={onClose}>
        <div className="group flex flex-col items-center gap-6 mx-auto w-full">
          <div className="items-center gap-6 grid grid-cols-1 xl:grid-cols-2 h-fit">
            <div className="relative max-w-lg">
              <h2 className='font-normal text-primary text-3xl'>{item?.name}</h2>
              {thumbsSwiper &&
                <SwiperWrapper
                  navigation
                  modules={[FreeMode, Navigation, Thumbs]}
                  thumbs={{ autoScrollOffset: 0, swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  items={images?.map((image: MediaFile, idx) => (
                    <div key={idx} className="relative size-full aspect-square overflow-hidden">
                      <Image src={image.file || '/placeholder.webp'} height={500} width={500} alt="" className="w-full object-cover" key={idx} />
                    </div>
                  ))}
                />
              }
            </div>
            <div className="space-y-4">
              <h2 className='font-normal text-primary text-3xl'>{item?.title}</h2>
              <p>{item?.description}</p>
              {item?.link && (
                <Link href={item?.link} target="_blank" rel="noopener noreferrer" className='font-semibold text-primary text-xl' >
                  Read More
                </Link>
              )}
            </div>
          </div>

          <div className="items-center gap-4 grid grid-cols-1 lg:grid-cols-2 w-full h-fit">
            <div className="col-span-full">
              {item?.images?.length &&
                <SwiperWrapper
                  navigation
                  freeMode={true}
                  spaceBetween={10}
                  slidesPerView={3}
                  className='thumbsSwiper'
                  watchSlidesProgress={true}
                  onSwiper={setThumbsSwiper}
                  modules={[FreeMode, Navigation, Thumbs]}
                  breakpoints={{
                    640: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 10,
                    },
                  }}
                  items={item?.images?.map((image: MediaFile, idx) => (
                    <Image src={image.file || '/placeholder.webp'} height={180} width={180} alt="thumbnail" className="p-1 border object-cover aspect-square" key={idx} />
                  ))}
                />}
            </div>
          </div>
        </div>
      </ModalWrapper>

    </>
  )
}
