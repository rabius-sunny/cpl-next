import { Toaster } from '@/components/ui/sonner'
import { UserProvider } from '@/lib/auth'
import retrieveUserFromSession from '@/utils/getUser'
import type { Metadata } from 'next'
import { Raleway, Roboto } from 'next/font/google'
import './globals.css'

const roboto = Roboto({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-roboto'
})

const raleway = Raleway({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-raleway'
})


const skipApiCall = process.env.NEXT_SKIP_API_CALLS

export async function generateMetadata(): Promise<Metadata> {
  if (!skipApiCall) return {
    title: 'Creative Paper Mills Ltd. (CPML)'
  }

  try {

    //   const data = await retrieveHomepage()
    // const siteData = data?.data

    const siteName = 'Creative Paper Mills Ltd. (CPML)'
    const aboutText = ''
    const logoUrl = '/default-og-image.jpg'
    const favicon = 'favicon.ico'

    return {
      title: {
        default: siteName,                // ✅ Sets the main title
        template: `%s | ${siteName}`,     // ✅ Template for other pages
      },
      description: aboutText,
      openGraph: {
        title: siteName,
        description: aboutText,
        type: 'website',
        url: process.env.NEXT_PUBLIC_APP_URL || '',
        images: [
          {
            url: logoUrl,
            width: 400,
            height: 200,
            alt: siteName,
          },
        ],
      },
      icons: {
        icon: logoUrl,
        shortcut: logoUrl,
        apple: logoUrl,
        other: [
          {
            rel: 'mask-icon',
            url: favicon,
            color: data?.colors?.primary || '#000000',
          },
        ],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'),
    }
  } catch (err) {
    console.error('Metadata generation failed:', err)

    return {
      title: 'Creative Paper Mills Ltd. (CPML)',
      description: '',
      openGraph: {
        title: 'Creative Paper Mills Ltd. (CPML)',
        description: '',
        type: 'website',
        url: process.env.NEXT_PUBLIC_APP_URL || '',
        images: ['/default-og-image.jpg'],
      },
    }
  }
}


export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const userPromise = retrieveUserFromSession()

  if (skipApiCall) {
    return (
      <html lang='en'>
        <body
          className={`${roboto.variable} ${raleway.variable}`}
          suppressHydrationWarning
        >
          <UserProvider userPromise={userPromise}>
            <Toaster richColors closeButton />
            <>{children}</>
          </UserProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang='en'>
      <body
        className={`${roboto.variable} ${raleway.variable}`}
        suppressHydrationWarning
      >
        <UserProvider userPromise={userPromise}>
          <Toaster richColors closeButton />
          <>{children}</>
        </UserProvider>
      </body>
    </html>
  )
}
