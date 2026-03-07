'use client'

import { createClient } from '../lib/supabase/client'
import { Lock } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error logging in:', error.message)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #7c3aed 0%, #0d0a1c 100%)',
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
            borderTop: '4px solid #a855f7',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTopColor: '#a855f7',
            borderTopWidth: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <Lock size={24} color="#a855f7" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#f4f4f5', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.15rem' }}>
              Caption Control Center
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>
              Superadmin access required
            </p>
          </div>
          <button
            onClick={handleGoogleLogin}
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
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
            Sign in with Google
          </button>
        </div>
      </div>
    </main>
  )
}
