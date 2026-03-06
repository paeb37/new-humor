'use client'

import { createClient } from '../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        padding: '0.625rem 1.25rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <LogOut size={16} /> Sign Out
    </button>
  )
}
