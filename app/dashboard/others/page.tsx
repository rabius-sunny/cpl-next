'use client'

import CKEditorComponent from '@/components/shared/CKEditor'
// import EditorExample from '@/components/shared/EditorExample'
import { useState } from 'react'

type TProps = {}

export default function OthersPage({}: TProps) {
  const [data, setData] = useState('')
  return (
    <div>
      {/* <EditorExample /> */}
      <CKEditorComponent onSave={setData} />
    </div>
  )
}
