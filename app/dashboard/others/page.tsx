'use client'

import CKEditorComponent from '@/components/shared/CKEditor'
import EditorExample from '@/components/shared/EditorExample'
import { useState } from 'react'
// @ts-ignore
import parser from 'react-html-parser'

type TProps = {}

export default function OthersPage({}: TProps) {
  const [data, setData] = useState('')
  return (
    <div>
      <EditorExample />
      <CKEditorComponent onSave={setData} />

      <div className='mt-8'>
        <h1 className='text0-xl'>Preview</h1>
        {/* <div dangerouslySetInnerHTML={{ __html: data }} /> */}
        {parser(data)}
      </div>
    </div>
  )
}
