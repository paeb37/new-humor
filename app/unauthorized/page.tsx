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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #9f1239 0%, #0d0a1c 100%)',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(10px)',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '500px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(159, 18, 57, 0.2)',
        }}
      >
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <ShieldX size={56} color="#f43f5e" />
        </div>
        <h1 style={{ color: '#f4f4f5', marginBottom: '1rem', fontSize: '2rem', fontWeight: 700 }}>
          Access Denied
        </h1>
        <p style={{ color: '#d4d4d8', marginBottom: '2rem', lineHeight: 1.6 }}>
          You need superadmin privileges to access the Caption Control Center.
        </p>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem', fontSize: '0.9rem' }}>
          If you believe this is an error, please contact an administrator to
          grant you superadmin access.
        </p>
        <button
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            color: '#fff',
            padding: '0.875rem 2rem',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Sign Out
        </button>
      </div>
    </main>
  )
}
