import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EmailManager from './EmailManager'

export default async function WhitelistEmailsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: emails } = await supabase
    .from('whitelist_email_addresses')
    .select('*')
    .order('created_datetime_utc', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
          padding: '1.5rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              &larr; Back to Dashboard
            </Link>
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>
              Whitelisted Email Addresses
            </h1>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
              Total Emails
            </div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {emails?.length || 0}
            </div>
          </div>
        </div>

        <EmailManager emails={emails || []} />
      </main>
    </div>
  )
}
