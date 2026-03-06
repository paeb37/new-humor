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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #7c3aed 0%, #0d0a1c 100%)',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(10px)',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '400px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
        }}
      >
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <Lock size={48} color="#a855f7" />
        </div>
        <h1 style={{ color: '#f4f4f5', marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: 700 }}>
          Caption Control Center
        </h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Superadmin access required
        </p>
        <button
          onClick={handleGoogleLogin}
          style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            color: '#fff',
            padding: '0.875rem 2rem',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(168, 85, 247, 0.5)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(168, 85, 247, 0.4)'
          }}
        >
          Sign in with Google
        </button>
        <p style={{ color: '#71717a', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          Only superadmin users can access this panel
        </p>
      </div>
    </main>
  )
}
