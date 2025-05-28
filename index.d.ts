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

type SocialLink = {
  title?: string
  link?: string
}

type SocialLinkTeam = {
  icon?: string
  link?: string
}

// Section types
type Logo = MediaFile

type BannerProduct = {
  description?: string
  features?: {
    key?: string
    value?: string
  }[]
  images?: MediaFile[]
}

type BannersSection = {
  title?: string
  subTitle?: string
  description?: string
  image?: MediaFile
  product?: BannerProduct
}

type AboutSection = {
  title?: string
  subtitle?: string
  description?: string
  images?: MediaFile[]
  stats?: {
    title?: string
    count?: number
  }[]
  teamfirst?: {
    name?: string
    designation?: string
    image?: MediaFile
  }[]
  teamsecond?: {
    name?: string
    designation?: string
    image?: MediaFile
  }[]
}

type ClientsSection = {
  title?: string
  subtitle?: string
  logos?: {
    image?: MediaFile
    link?: string
  }[]
}

type ContactSection = {
  title?: string
  banner?: MediaFile
}

type FooterSection = {
  aboutText?: string
  getInTouch?: {
    key?: string
    value?: string
  }[]
  socialMoto?: string
  socialLinks?: {
    icon?: string
    link?: string
  }[]
}

// Main content type
type SiteContentData = {
  logo?: Logo
  banners?: BannersSection[]
  about?: AboutSection
  clients?: ClientsSection
  contact?: ContactSection
  footer?: FooterSection
}

type AllData = {
  logo?: Logo
  banners?: BannersSection[]
  about?: AboutSection
  clients?: ClientsSection
  contact?: ContactSection
  footer?: FooterSection
  products: Products
  services: Services
  projects: Projects
}

// Complete site content type
type SiteContent = {
  _id?: string
  content: SiteContentData
  createdAt?: string | Date
  updatedAt?: string | Date
}

type ResponseData = {
  success: boolean
  data?: SiteContentData | null
  error?: string
}
type OthersResponse = {
  success: boolean
  data?: OthersContent | null
  error?: string
}

type ProductItem = {
  name?: string
  icon?: MediaFile
  thumbnail?: MediaFile
  images?: MediaFile[]
  title: string
  description: string
  link?: string
}

type Products = {
  title?: string
  rightText: string
  leftText: string
  items: ProductItem[]
}

type ServiceItem = {
  title?: string
  subTitle?: string
  banner?: MediaFile
  images?: MediaFile[]
  description?: string
  link?: string
}

type Services = {
  title?: string
  description?: string
  items?: ServiceItem[]
}

type ProjectItem = {
  title?: string
  link?: string
  description?: string
  banner?: MediaFile
  images?: MediaFile[]
}

type Projects = {
  title?: string
  subtitle?: string
  items?: ProjectItem[]
}

type OthersContent = {
  products: Products
  services: Services
  projects: Projects
}
