'use client'
import { createContactData } from '@/actions/data/others-content'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import AnimatedButton from './AnimatedButton'

// Define the validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  subject: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  message: z.string().optional()
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
      name: '',
      subject: '',
      email: '',
      phone: '',
      message: ''
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

      toast.success('Message sent successfully!')
      reset()
    } catch {
      toast.error('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
      <div className="flex gap-6">
        <div className='w-full'>
          <InputField placeholder='First Name' {...register('name')} />
          {errors.name && (
            <p className='mt-1 text-red-400 text-sm'>{errors.name.message}</p>
          )}
        </div>

        <div className='w-full'>
          <InputField placeholder='Subject' {...register('subject')} />
          {errors.name && (
            <p className='mt-1 text-red-400 text-sm'>{errors.subject?.message}</p>
          )}
        </div>
      </div>


      <div className="flex lg:flex-row flex-col gap-6">
        <div className='w-full'>
          <InputField placeholder='Email' type='email' {...register('email')} />
          {errors.email && <p className='mt-1 text-red-400 text-sm'>{errors.email.message}</p>}
        </div>

        <div className='w-full'>
          <InputField placeholder='Phone' type='tel' {...register('phone')} />
          {errors.phone && <p className='mt-1 text-red-400 text-sm'>{errors.phone.message}</p>}
        </div>

      </div>

      <div>
        <textarea
          placeholder='Message'
          {...register('message')}
          className={cn('py-4 bg-white placeholder:text-slate-400 text-black focus:outline-0 focus:ring-0 w-full border-b')}
          rows={5}
        />
        {errors.message && <p className='mt-1 text-red-400 text-sm'>{errors.message.message}</p>}
      </div>

      <div className='flex justify-center'>
        <AnimatedButton type="submit" className='bg-white disabled:opacity-50 px-12 border-2 border-primary hover:border-secondary text-primary hover:text-white transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed'>
          {isSubmitting ? 'Sending...' : 'Send'}
        </AnimatedButton>
      </div>
    </form>
  )
}

const InputField = ({ className, type, ...props }: React.ComponentProps<'input'>) => (
  <input
    type={type}
    className={cn(
      'py-3 bg-white placeholder:text-slate-400 text-black focus:outline-0 focus:ring-0 w-full border-b',
      className
    )}
    {...props}
  />
)
