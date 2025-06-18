import {
  FileText,
  Home,
  Lightbulb, Settings,
  ShoppingBag, Users
} from 'lucide-react'

export const siteContentNavItems = [
  {
    label: 'Home Page',
    link: '/dashboard/homepage',
    icon: <Home className='mr-2 w-4 h-4' />
  },
  {
    label: 'Products',
    link: '/dashboard/products',
    icon: <ShoppingBag className='mr-2 w-4 h-4' />
  },
  {
    label: 'About',
    link: '/dashboard/about',
    icon: <FileText className='mr-2 w-4 h-4' />
  },
  {
    label: 'Custom pages',
    link: '/dashboard/custom',
    icon: <Lightbulb className='mr-2 w-4 h-4' />
  },
  // {
  //   label: 'Projects',
  //   link: '/dashboard/projects',
  //   icon: <SquareStack className='mr-2 w-4 h-4' />
  // },
  // {
  //   label: 'Clients',
  //   link: '/dashboard/clients',
  //   icon: <ShoppingBag className='mr-2 w-4 h-4' />
  // },
  // {
  //   label: 'Contact',
  //   link: '/dashboard/contact',
  //   icon: <Phone className='mr-2 w-4 h-4' />
  // },
  // {
  //   label: 'Footer',
  //   link: '/dashboard/footer',
  //   icon: <Settings className='mr-2 w-4 h-4' />
  // }
]

export const adminNavItems = [
  {
    label: 'Go to Site',
    link: '/',
    icon: <Home className='mr-2 w-4 h-4' />
  },
  {
    label: 'Site Content',
    link: '',
    icon: <Settings className='mr-2 w-4 h-4' />,
    children: siteContentNavItems
  },
  // {
  //   label: 'Bookings',
  //   link: '/dashboard/bookings',
  //   icon: <Ticket className='mr-2 w-4 h-4' />
  // },
  {
    label: 'Users',
    link: '/dashboard/users',
    icon: <Users className='mr-2 w-4 h-4' />
  }
]

export const siteConfig = {
  name: 'Next.js Template',
  description: 'A simple Next.js template with Tailwind CSS and Lucide Icons.',
  mainNav: [
    { title: 'Home' },
    { title: 'Our Products' },
    { title: 'About Us' },
    { title: 'Our Services' },
    { title: 'Projects' },
    { title: 'Our Clients' },
    { title: 'Contact Us' }
  ],
  footerNav: [
    {
      title: 'Privacy Policy',
      href: '/privacy'
    }
  ],
  socialNav: [
    {
      title: 'Facebook',
      href: 'https://www.facebook.com'
    },
    {
      title: 'Twitter',
      href: 'https://www.twitter.com'
    },
    {
      title: 'Instagram',
      href: 'https://www.instagram.com'
    },
    {
      title: 'LinkedIn',
      href: 'https://www.linkedin.com'
    }
  ]
}
