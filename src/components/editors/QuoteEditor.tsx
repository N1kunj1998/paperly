'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase-browser'
import { generateSlug } from '@/lib/slugify'
import { useAuth } from '@/components/AuthProvider'
import { Plus, Trash2, Download, Share2, Loader2 } from 'lucide-react'
import EditorLayout from './EditorLayout'
import { downloadPDF } from '@/lib/pdf/downloadPDF'
import QuotePDF from '@/lib/pdf/QuotePDF'
import { createElement } from 'react'

interface LineItem { description: string; qty: number; rate: number }
interface QuoteData {
  from: { name: string; email: string; address: string }
  to: { name: string; email: string }
  quote_number: string
  issue_date: string
  valid_until: string
  line_items: LineItem[]
  tax_rate: number
  notes: string
}

const defaultData: QuoteData = {
  from: { name: '', email: '', address: '' },
  to: { name: '', email: '' },
  quote_number: 'QTE-001',
  issue_date: new Date().toISOString().split('T')[0],
  valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  line_items: [{ description: '', qty: 1, rate: 0 }],
  tax_rate: 0,
  notes: 'This quote is valid for 30 days.',
}

export default function QuoteEditor() {
  const [data, setData] = useState<QuoteData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const { user } = useAuth()
  const supabase = createClient()

  const subtotal = data.line_items.reduce((s, i) => s + i.qty * i.rate, 0)
  const tax = subtotal * data.tax_rate / 100
  const total = subtotal + tax

  const updateLineItem = (i: number, field: keyof LineItem, value: string | number) =>
    setData(d => { const items = [...d.line_items]; items[i] = { ...items[i], [field]: value }; return { ...d, line_items: items } })

  const handleSaveAndShare = async () => {
    setSaving(true)
    const slug = generateSlug()
    const { error } = await supabase.from('documents').insert({ type: 'quote', slug, data, user_id: user?.id ?? null })
    if (!error) {
      const url = `${window.location.origin}/doc/${slug}`
      setShareUrl(url)
      await navigator.clipboard.writeText(url).catch(() => {})
    }
    setSaving(false)
  }

  const form = (
    <>
      <h2 className="font-semibold text-gray-800">Quote Details</h2>

        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs text-gray-500">Quote #</Label><Input value={data.quote_number} onChange={e => setData(d => ({ ...d, quote_number: e.target.value }))} /></div>
          <div><Label className="text-xs text-gray-500">Issue Date</Label><Input type="date" value={data.issue_date} onChange={e => setData(d => ({ ...d, issue_date: e.target.value }))} /></div>
          <div className="col-span-2"><Label className="text-xs text-gray-500">Valid Until</Label><Input type="date" value={data.valid_until} onChange={e => setData(d => ({ ...d, valid_until: e.target.value }))} /></div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">From</p>
          <Input placeholder="Your name" value={data.from.name} onChange={e => setData(d => ({ ...d, from: { ...d.from, name: e.target.value } }))} />
          <Input placeholder="Your email" value={data.from.email} onChange={e => setData(d => ({ ...d, from: { ...d.from, email: e.target.value } }))} />
          <Input placeholder="Your address" value={data.from.address} onChange={e => setData(d => ({ ...d, from: { ...d.from, address: e.target.value } }))} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">Quote For</p>
          <Input placeholder="Client name" value={data.to.name} onChange={e => setData(d => ({ ...d, to: { ...d.to, name: e.target.value } }))} />
          <Input placeholder="Client email" value={data.to.email} onChange={e => setData(d => ({ ...d, to: { ...d.to, email: e.target.value } }))} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">Services</p>
          {data.line_items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input placeholder="Service" className="flex-1" value={item.description} onChange={e => updateLineItem(i, 'description', e.target.value)} />
              <Input type="number" placeholder="Qty" className="w-14" value={item.qty} onChange={e => updateLineItem(i, 'qty', Number(e.target.value))} />
              <Input type="number" placeholder="Rate" className="w-20" value={item.rate} onChange={e => updateLineItem(i, 'rate', Number(e.target.value))} />
              <button onClick={() => setData(d => ({ ...d, line_items: d.line_items.filter((_, idx) => idx !== i) }))} className="text-gray-300 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setData(d => ({ ...d, line_items: [...d.line_items, { description: '', qty: 1, rate: 0 }] }))} className="w-full"><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
        </div>

        <div><Label className="text-xs text-gray-500">Tax Rate (%)</Label><Input type="number" value={data.tax_rate} onChange={e => setData(d => ({ ...d, tax_rate: Number(e.target.value) }))} /></div>
        <div><Label className="text-xs text-gray-500">Notes</Label><Textarea value={data.notes} onChange={e => setData(d => ({ ...d, notes: e.target.value }))} rows={3} /></div>

        <div className="flex gap-2 pt-2">
          <Button onClick={() => downloadPDF(createElement(QuotePDF, data), `quote-${data.quote_number}.pdf`)} variant="outline" className="flex-1"><Download className="h-4 w-4 mr-1" /> PDF</Button>
          <Button onClick={handleSaveAndShare} className="flex-1" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Share2 className="h-4 w-4 mr-1" />} Share
          </Button>
        </div>

        {shareUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
            <p className="text-green-700 font-medium mb-1">Link copied! 🎉</p>
            <a href={shareUrl} target="_blank" className="text-blue-600 break-all underline text-xs">{shareUrl}</a>
          </div>
        )}
    </>
  )

  const preview = (
    <div className="bg-white rounded-xl border p-6 md:p-10 max-w-2xl mx-auto shadow-sm">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-widest">Quote</h1>
              <p className="text-gray-400 mt-1">#{data.quote_number}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Issued: {data.issue_date}</p>
              <p>Valid until: {data.valid_until}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">From</p>
              <p className="text-gray-800 font-medium">{data.from.name || '—'}</p>
              <p className="text-gray-500 text-sm">{data.from.email}</p>
              <p className="text-gray-500 text-sm">{data.from.address}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Prepared For</p>
              <p className="text-gray-800 font-medium">{data.to.name || '—'}</p>
              <p className="text-gray-500 text-sm">{data.to.email}</p>
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead><tr className="border-b text-gray-400 text-xs uppercase"><th className="text-left py-2 font-medium">Service</th><th className="text-right py-2 font-medium">Qty</th><th className="text-right py-2 font-medium">Rate</th><th className="text-right py-2 font-medium">Amount</th></tr></thead>
            <tbody>
              {data.line_items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 text-gray-700">{item.description || <span className="text-gray-300 italic">Service description</span>}</td>
                  <td className="py-3 text-right text-gray-600">{item.qty}</td>
                  <td className="py-3 text-right text-gray-600">${Number(item.rate).toFixed(2)}</td>
                  <td className="py-3 text-right font-medium text-gray-800">${(item.qty * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right space-y-1 text-sm mb-8">
            <p className="text-gray-500">Subtotal: <span className="text-gray-800 font-medium ml-4">${subtotal.toFixed(2)}</span></p>
            <p className="text-gray-500">Tax ({data.tax_rate}%): <span className="text-gray-800 font-medium ml-4">${tax.toFixed(2)}</span></p>
            <div className="border-t pt-2"><p className="text-xl font-bold text-gray-900">Estimated Total: ${total.toFixed(2)}</p></div>
          </div>

          {data.notes && <div className="border-t pt-6 text-sm text-gray-500"><p className="font-semibold text-gray-700 mb-1">Notes</p><p>{data.notes}</p></div>}
          <div className="mt-10 pt-6 border-t text-center text-xs text-gray-300">Made with Paperly · paperly.app</div>
        </div>
  )

  return <EditorLayout form={form} preview={preview} />
}
