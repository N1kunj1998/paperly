'use client'

import { useState } from 'react'
import { FileText, Eye } from 'lucide-react'

interface EditorLayoutProps {
  form: React.ReactNode
  preview: React.ReactNode
}

export default function EditorLayout({ form, preview }: EditorLayoutProps) {
  const [tab, setTab] = useState<'form' | 'preview'>('form')

  return (
    <>
      {/* Mobile tab switcher */}
      <div className="flex md:hidden border rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => setTab('form')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            tab === 'form' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FileText className="h-4 w-4" /> Form
        </button>
        <button
          onClick={() => setTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            tab === 'preview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100vh-120px)]">
        {/* Form panel */}
        <div className={`
          w-full md:w-[420px] md:flex-shrink-0 overflow-y-auto bg-white rounded-xl border p-5 md:p-6 space-y-5
          ${tab === 'preview' ? 'hidden md:block' : 'block'}
        `}>
          {form}
        </div>

        {/* Preview panel */}
        <div className={`
          flex-1 overflow-y-auto
          ${tab === 'form' ? 'hidden md:block' : 'block'}
        `}>
          {preview}
        </div>
      </div>
    </>
  )
}
