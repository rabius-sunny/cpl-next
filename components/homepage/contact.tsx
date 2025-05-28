'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { SectionHeading } from '../common'
import ContactForm from '../common/contact-form'

type TProps = {
  data: ContactSection | undefined
}

export default function ContactSection({ data }: TProps) {
  return (
    <section
      id='contact_us'
      className={cn('grid grid-cols-2')}
    >
      <div className='flex flex-col items-center col-span-2 lg:col-span-1 bg-[#18232b] px-4 sm:px-8 md:px-16 lg:px-16 2xl:px-36 py-20 3'>
        <div className='flex flex-col md:flex-col gap-16 w-full h-full text-white'>
          <div className='space-y-2 text-center'>
            <SectionHeading title='Contact Us' />
          </div>

          {/* Contact Form */}
          <div className='w-full'>
            <ContactForm />
          </div>
        </div>
      </div>
      <div className='hidden lg:block relative lg:col-span-1 size-full overflow-hidden'>
        <Image
          src={data?.banner?.file || '/placeholder.webp'}
          alt='Contact Background'
          height={500}
          width={500}
          className='size-full object-cover'
        />
        <div className="top-0 absolute flex justify-center items-center bg-gray-700/20 size-full">
          <h2 className='max-w-lg font-title font-semibold text-white text-3xl text-center'>{data?.title}</h2>
        </div>
      </div>
    </section>
  )
}
