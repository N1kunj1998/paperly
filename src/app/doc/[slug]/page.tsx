import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { FileText } from 'lucide-react'
import Link from 'next/link'

interface LineItem { description: string; qty: number; rate: number }
interface Party { name?: string; email?: string; address?: string }
interface DocData {
  from?: Party
  to?: Party
  invoice_number?: string
  receipt_number?: string
  quote_number?: string
  issue_date?: string
  due_date?: string
  valid_until?: string
  date?: string
  line_items?: LineItem[]
  tax_rate?: number
  notes?: string
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabase.from('documents').select('type, data').eq('slug', slug).single()
  if (!data) return { title: 'Document not found' }
  const doc = data.data as { invoice_number?: string; receipt_number?: string; quote_number?: string }
  const docNumber = doc.invoice_number ?? doc.receipt_number ?? doc.quote_number
  const label = `${data.type.charAt(0).toUpperCase()}${data.type.slice(1)}${docNumber ? ` #${docNumber}` : ''}`
  return {
    title: label,
    description: `View and download this ${data.type} created with Paperly.`,
  }
}

export default async function DocViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return notFound()

  const doc = data.data as DocData
  const items = doc.line_items ?? []
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0)
  const taxRate = doc.tax_rate ?? 0
  const tax = subtotal * taxRate / 100
  const total = subtotal + tax
  const docNumber = doc.invoice_number ?? doc.receipt_number ?? doc.quote_number

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-lg">Paperly</span>
        </Link>
        <span className="text-sm text-gray-500 capitalize">{data.type} · {slug}</span>
      </nav>

      <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow p-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-widest">{data.type}</h1>
            {docNumber && <p className="text-gray-500 mt-1">#{docNumber}</p>}
          </div>
          <div className="text-right text-sm text-gray-500">
            {doc.issue_date && <p>Issued: {doc.issue_date}</p>}
            {doc.date && <p>Date: {doc.date}</p>}
            {doc.due_date && <p>Due: {doc.due_date}</p>}
            {doc.valid_until && <p>Valid until: {doc.valid_until}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {doc.from && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">From</p>
              {doc.from.name && <p className="text-gray-800 font-medium">{doc.from.name}</p>}
              {doc.from.email && <p className="text-gray-500 text-sm">{doc.from.email}</p>}
              {doc.from.address && <p className="text-gray-500 text-sm">{doc.from.address}</p>}
            </div>
          )}
          {doc.to && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">To</p>
              {doc.to.name && <p className="text-gray-800 font-medium">{doc.to.name}</p>}
              {doc.to.email && <p className="text-gray-500 text-sm">{doc.to.email}</p>}
              {doc.to.address && <p className="text-gray-500 text-sm">{doc.to.address}</p>}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b text-gray-400 text-xs uppercase">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 text-gray-700">{item.description}</td>
                  <td className="py-2 text-right text-gray-700">{item.qty}</td>
                  <td className="py-2 text-right text-gray-700">${Number(item.rate).toFixed(2)}</td>
                  <td className="py-2 text-right text-gray-700">${(item.qty * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="text-right space-y-1 text-sm">
          <p className="text-gray-500">Subtotal: <span className="text-gray-800 font-medium">${subtotal.toFixed(2)}</span></p>
          <p className="text-gray-500">Tax ({taxRate}%): <span className="text-gray-800 font-medium">${tax.toFixed(2)}</span></p>
          <p className="text-lg font-bold text-gray-900">Total: ${total.toFixed(2)}</p>
        </div>

        {doc.notes && (
          <div className="mt-8 pt-6 border-t text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Notes</p>
            <p>{doc.notes}</p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t text-center text-xs text-gray-300">
          Made with Paperly · paperly.app
        </div>
      </div>
    </div>
  )
}
