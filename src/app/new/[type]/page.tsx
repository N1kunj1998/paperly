'use client'

import { useParams } from 'next/navigation'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import InvoiceEditor from '@/components/editors/InvoiceEditor'
import ReceiptEditor from '@/components/editors/ReceiptEditor'
import QuoteEditor from '@/components/editors/QuoteEditor'

export default function NewDocPage() {
  const { type } = useParams<{ type: string }>()

  const validTypes = ['invoice', 'receipt', 'quote']
  if (!validTypes.includes(type)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid document type.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-lg">Paperly</span>
        </Link>
        <span className="text-sm text-gray-500 capitalize">{type} Editor</span>
      </nav>

      {/* Editor */}
      <div className="max-w-7xl mx-auto p-6">
        {type === 'invoice' && <InvoiceEditor />}
        {type === 'receipt' && <ReceiptEditor />}
        {type === 'quote' && <QuoteEditor />}
      </div>
    </div>
  )
}
