import { retrieveHomepage } from '@/actions/data/homepage'

type TProps = {}

export default async function Footer({}: TProps) {
  const data = await retrieveHomepage()
  return <div>Footer</div>
}
