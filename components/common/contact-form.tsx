'use client'
import { createContactData } from '@/actions/data/others-content'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRightCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

// Define the validation schema
const contactFormSchema = z.object({
  firstname: z.string().min(2, { message: 'First name is required' }),
  lastname: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  date: z.string().min(1, { message: 'Please select a date' }),
  time: z.string().min(1, { message: 'Please select a time' })
})

// Type for the form data
export type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      date: '',
      time: ''
    }
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      const createRes = await createContactData(data)
      if (!createRes.success) {
        toast.error('Error submitting form. Please try again.')
        return
      }

      toast.success('Booked successfully!')
      reset()
    } catch {
      toast.error('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      <div className='flex md:flex-row flex-col gap-6'>
        <div className='w-full'>
          <InputField placeholder='First Name' {...register('firstname')} />
          {errors.firstname && (
            <p className='mt-1 text-red-400 text-sm'>{errors.firstname.message}</p>
          )}
        </div>
        <div className='w-full'>
          <InputField placeholder='Last Name' {...register('lastname')} />
          {errors.lastname && (
            <p className='mt-1 text-red-400 text-sm'>{errors.lastname.message}</p>
          )}
        </div>
      </div>

      <div>
        <InputField placeholder='Email' type='email' {...register('email')} />
        {errors.email && <p className='mt-1 text-red-400 text-sm'>{errors.email.message}</p>}
      </div>

      <div>
        <InputField placeholder='Phone' type='tel' {...register('phone')} />
        {errors.phone && <p className='mt-1 text-red-400 text-sm'>{errors.phone.message}</p>}
      </div>

      <div className='flex md:flex-row flex-col gap-6'>
        <div className='w-full'>
          <InputField type='date' placeholder='Select Date' {...register('date')} />
          {errors.date && <p className='mt-1 text-red-400 text-sm'>{errors.date.message}</p>}
        </div>
        <div className='w-full'>
          <InputField type='time' placeholder='Select Time' {...register('time')} />
          {errors.time && <p className='mt-1 text-red-400 text-sm'>{errors.time.message}</p>}
        </div>
      </div>

      <div className='flex justify-center'>
        <button type='submit' disabled={isSubmitting} className='inline-flex items-center gap-2 bg-white hover:bg-gray-100 disabled:opacity-50 px-6 py-3 rounded-full text-gray-800 text-base uppercase transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed'>
          {isSubmitting ? 'Booking...' : 'Book now'}
          <ChevronRightCircle strokeWidth={1.3} />
        </button>
      </div>
    </form>
  )
}

const InputField = ({ className, type, ...props }: React.ComponentProps<'input'>) => (
  <input
    type={type}
    className={cn(
      'py-3 bg-white placeholder:text-slate-400 px-6 text-black rounded-full focus:outline-0 focus:ring-0 w-full',
      className
    )}
    {...props}
  />
)
