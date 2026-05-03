'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/components/AuthProvider'
import { getProfile, type UserProfile } from '@/lib/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Loader2, User } from 'lucide-react'

interface ProfileModalProps {
  onClose: () => void
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const existing = getProfile(user)

  const [form, setForm] = useState<UserProfile>({
    name: existing?.name ?? user?.user_metadata?.full_name ?? '',
    company: existing?.company ?? '',
    email: existing?.email ?? user?.email ?? '',
    address: existing?.address ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await supabase.auth.updateUser({ data: { profile: form } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <User className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Your profile</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">Saved here, auto-filled in every new document.</p>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-500">Full name</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Company (optional)</Label>
            <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Jane Doe Design" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Address (optional)</Label>
            <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St, City" />
          </div>
        </div>

        <Button className="w-full mt-5" onClick={handleSave} disabled={saving || saved}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : saved ? '✓ Saved!' : 'Save profile'}
        </Button>
      </div>
    </div>
  )
}
