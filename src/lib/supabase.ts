import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type DocumentType = 'invoice' | 'receipt' | 'quote'

export interface Document {
  id: string
  type: DocumentType
  slug: string
  data: Record<string, unknown>
  created_at: string
  user_id: string | null
}
