'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/components/AuthProvider'
import { ImagePlus, X, Loader2 } from 'lucide-react'

interface LogoUploadProps {
  value: string        // current logo URL
  onChange: (url: string) => void
}

export default function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const handleFile = async (file: File) => {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Max 2 MB'); return }
    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `${user?.id ?? 'anon'}/${Date.now()}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('logos')
      .upload(path, file, { upsert: true })

    if (uploadErr) {
      setError(uploadErr.message)
    } else {
      const { data } = supabase.storage.from('logos').getPublicUrl(path)
      onChange(data.publicUrl)
    }
    setUploading(false)
  }

  const handleRemove = () => onChange('')

  return (
    <div className="space-y-1">
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Logo" className="h-16 max-w-[160px] object-contain border rounded-lg p-1 bg-white" />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors w-full justify-center"
        >
          {uploading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
            : <><ImagePlus className="h-4 w-4" /> Add logo</>
          }
        </button>
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
