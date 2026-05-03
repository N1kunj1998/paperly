import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  name: string
  company: string
  email: string
  address: string
}

export function getProfile(user: User | null): UserProfile | null {
  if (!user) return null
  const p = user.user_metadata?.profile as UserProfile | undefined
  if (!p?.name && !p?.company) return null
  return p ?? null
}
