type TUser = {
  id: string
  email: string
}

// Base types
type MediaFile = {
  thumbnail?: string
  file?: string
  fileId?: string
}

type Logo = MediaFile

// Homepage Navigation Types
type NavChildItem = {
  title: string
  link: string
}

type NavItem = {
  title: string
  link: string
  childrens?: NavChildItem[]
}

type NavCTA = {
  text: string
  link: string
}

type NavSection = {
  logo?: MediaFile
  cta?: NavCTA
  items?: NavItem[]
}

// Homepage Slider Types
type SliderItem = {
  backgroundImage?: MediaFile
  title?: string
  subtitle?: string
  images?: MediaFile[]
}

// Homepage About Types
type AboutSection = {
  title?: string
  description?: string
}

// Homepage Stats Types
type StatItem = {
  title?: string
  count?: number
}

type StatsSection = {
  title?: string
  backgroundImage?: MediaFile
  stats?: StatItem[]
}

// Homepage Testimonials Types
type TestimonialItem = {
  message?: string
  name?: string
  designation?: string
}

type TestimonialsSection = {
  title?: string
  subtitle?: string
  items?: TestimonialItem[]
}

// Homepage Video Types
type VideoSection = MediaFile

// Homepage Footer Types
type OfficeSection = {
  items?: string[]
}

type FactorySection = {
  items?: string[]
}

type SocialItem = {
  icon?: string
  link?: string
}

type FooterSection = {
  office?: OfficeSection
  factory?: FactorySection
  social?: SocialItem[]
  copyright?: string
}

// Main Homepage Content Type
type HomePageContent = {
  nav?: NavSection
  sliders?: SliderItem[]
  about?: AboutSection
  stats?: StatsSection
  testimonials?: TestimonialsSection
  video?: VideoSection
  footer?: FooterSection
}

type Product = {
  name: string
  description: string
  features: Array<{
    key: string
    value: string
    _id?: string
  }>
  thumbnail?: {
    file: string
    fileId: string
    thumbnail: string
  }
  images?: Array<{
    file: string
    fileId: string
    thumbnail: string
  }>
}

type Aboutus = {
  title?: string
  backgroundImage?: {
    file?: string
    fileId?: string
    thumbnail?: string
  }
  history?: {
    title?: string
    description?: string
    image?: {
      file?: string
      fileId?: string
      thumbnail?: string
    }
  }
  mission?: {
    title?: string
    description?: string
    image?: {
      file?: string
      fileId?: string
      thumbnail?: string
    }
  }
  leadership?: {
    title?: string
    description?: string
    leaders?: Array<{
      name?: string
      designation?: string
      bio?: string
    }>
  }
  bottomImage?: {
    file?: string
    fileId?: string
    thumbnail?: string
  }
}
