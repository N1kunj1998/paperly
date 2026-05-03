'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Receipt, MessageSquareQuote, Plus, Trash2, ExternalLink, LogOut, UserCircle, Copy } from 'lucide-react'
import ProfileModal from '@/components/ProfileModal'
import { createClient as createBrowserClient } from '@/lib/supabase-browser'
import { generateSlug } from '@/lib/slugify'

interface Doc {
  id: string
  type: string
  slug: string
  data: Record<string, unknown>
  created_at: string
}

interface Props {
  user: User
  documents: Doc[]
}

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string; badge: string }> = {
  invoice: { label: 'Invoice', icon: FileText, color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  receipt: { label: 'Receipt', icon: Receipt, color: 'text-green-600', badge: 'bg-green-100 text-green-700' },
  quote:   { label: 'Quote',   icon: MessageSquareQuote, color: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
}

function getDocNumber(doc: Doc): string {
  const d = doc.data as Record<string, string>
  return d.invoice_number ?? d.receipt_number ?? d.quote_number ?? '—'
}

function getDocParty(doc: Doc): string {
  const d = doc.data as { to?: { name?: string } }
  return d.to?.name || '—'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DashboardClient({ user, documents: initial }: Props) {
  const [docs, setDocs] = useState<Doc[]>(initial)
  const [filter, setFilter] = useState<string>('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [duplicating, setDuplicating] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const browserSupabase = createBrowserClient()

  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return
    setDeleting(id)
    await supabase.from('documents').delete().eq('id', id)
    setDocs(prev => prev.filter(d => d.id !== id))
    setDeleting(null)
  }

  const handleDuplicate = async (doc: Doc) => {
    setDuplicating(doc.id)
    const slug = generateSlug()
    const data = { ...doc.data }
    // increment doc number
    const numKey = doc.type === 'invoice' ? 'invoice_number' : doc.type === 'receipt' ? 'receipt_number' : 'quote_number'
    const current = (data as Record<string, string>)[numKey] ?? ''
    const match = current.match(/^(.*?)(\d+)$/)
    if (match) (data as Record<string, string>)[numKey] = match[1] + (parseInt(match[2]) + 1)

    const { data: inserted } = await browserSupabase
      .from('documents')
      .insert({ type: doc.type, slug, data, user_id: user.id })
      .select()
      .single()

    if (inserted) setDocs(prev => [inserted, ...prev])
    setDuplicating(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-lg">Paperly</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
          <Button variant="outline" size="sm" onClick={() => setShowProfile(true)}>
            <UserCircle className="h-4 w-4 mr-1" /> Profile
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-1" /> Sign out
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
            <p className="text-sm text-gray-500 mt-0.5">{docs.length} document{docs.length !== 1 ? 's' : ''} saved</p>
          </div>
          <div className="flex gap-2">
            <Link href="/new/invoice"><Button size="sm"><Plus className="h-4 w-4 mr-1" /> New</Button></Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'invoice', 'receipt', 'quote'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === t ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Doc list */}
        {filtered.length === 0 ? (
          <div className="bg-white border rounded-xl p-16 text-center">
            <FileText className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No documents yet</p>
            <p className="text-sm text-gray-400 mb-4">Create your first invoice, receipt, or quote</p>
            <div className="flex gap-3 justify-center">
              {['invoice', 'receipt', 'quote'].map(t => (
                <Link key={t} href={`/new/${t}`}>
                  <Button variant="outline" size="sm" className="capitalize">{t}</Button>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(doc => {
              const cfg = typeConfig[doc.type] ?? typeConfig.invoice
              const Icon = cfg.icon
              return (
                <div key={doc.id} className="bg-white border rounded-xl px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className={`${cfg.color} flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                      <span className="font-medium text-gray-900 text-sm">#{getDocNumber(doc)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      To: {getDocParty(doc)} · {formatDate(doc.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/doc/${doc.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDuplicate(doc)}
                      disabled={duplicating === doc.id}
                      className="text-gray-300 hover:text-blue-400 transition-colors p-1"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleting === doc.id}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
    {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  )
}
