type Params<Key extends string> = Promise<{ [K in Key]: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

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
  _id: string
  name: string
  slug: string
  description: string
  features: Array<{
    key: string
    value: string
    _id?: string
  }>
  thumbnail?: MediaFile
  images?: MediaFile[]
}

type Aboutus = {
  title?: string
  backgroundImage?: {
    file?: string
    fileId?: string
    thumbnail?: string
  }
  sections?: {
    title?: string
    description?: string
    image?: {
      file?: string
      fileId?: string
      thumbnail?: string
    }
  }[]
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

// Page Builder Types
type PageSection = {
  id: string
  type: 'header-banner' | 'content-section' | 'grid-layout' | 'image-text' | 'bottom-media'
  order: number
  data: any
}

type HeaderBannerSection = {
  image?: MediaFile
  title?: string
  subtitle?: string
}

type ContentSection = {
  title?: string
  content?: string
}

type GridItem = {
  id: string
  image?: MediaFile
  title?: string
  description?: string
}

type GridLayoutSection = {
  title?: string
  columns?: number
  items?: GridItem[]
}

type ImageTextSection = {
  image?: MediaFile
  title?: string
  content?: string
  imagePosition?: 'left' | 'right'
}

type BottomMediaSection = {
  media?: MediaFile
  type?: 'image' | 'video'
  title?: string
  description?: string
}

type CustomPage = {
  _id?: string
  title: string
  slug: string
  sections: PageSection[]
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}
