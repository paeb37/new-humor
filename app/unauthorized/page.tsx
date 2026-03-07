'use client'

import { createClient } from '../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ShieldX } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #9f1239 0%, #0d0a1c 100%)',
        paddingTop: '15vh',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTopColor: '#f43f5e',
            borderTopWidth: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <ShieldX size={24} color="#f43f5e" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#f4f4f5', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.15rem' }}>
              Access Denied
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>
              You need superadmin privileges to access this panel
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: '#fff',
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  )
}
