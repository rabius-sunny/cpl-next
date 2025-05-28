import { getProducts } from '@/actions/data/product'
import AdminProducts from '@/components/dashboard/AdminProducts'

type TProps = {}

export default async function ProductsPage({}: TProps) {
  const result = await getProducts()

  if (!result.success) {
    console.error('Failed to fetch products:', result.error)
    return (
      <div className='p-4'>
        <h1 className='text-lg font-semibold'>Error</h1>
        <p className='text-red-500'>{result.error}</p>
      </div>
    )
  }

  const products = result.success ? result.data : []

  return (
    <div>
      <AdminProducts data={products} />
    </div>
  )
}
