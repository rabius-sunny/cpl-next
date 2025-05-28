import { retrieveHomepage } from '@/actions/data/homepage'

type TProps = {}

export default async function Header({}: TProps) {
  const data = await retrieveHomepage()
  return <div>Header</div>
}
