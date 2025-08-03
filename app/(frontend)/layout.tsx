import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'

// export const metadata: Metadata = {
//   title: 'Home',
//   description: 'Creative Papers'
// }

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
