import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HumorFlavorsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: flavors } = await supabase
    .from('humor_flavors')
    .select('*')
    .order('created_datetime_utc', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
          padding: '1.5rem 2rem',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
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
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Humor Flavors</h1>
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
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Total Flavors</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {flavors?.length || 0}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
                  {['ID', 'Slug', 'Description', 'Created', 'Steps'].map((h) => (
                    <th
                      key={h}
                      style={{
                        color: '#a1a1aa',
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flavors?.map((row: any) => (
                  <tr
                    key={row.id}
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <td style={{ color: '#f4f4f5', padding: '1rem' }}>{row.id}</td>
                    <td style={{ color: '#d4d4d8', padding: '1rem' }}>{row.slug ?? '-'}</td>
                    <td style={{ color: '#d4d4d8', padding: '1rem' }}>
                      {row.description ?? <span style={{ color: '#a1a1aa' }}>—</span>}
                    </td>
                    <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                      {row.created_datetime_utc
                        ? new Date(row.created_datetime_utc).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Link
                        href={`/admin/humor-flavors/${row.id}/steps`}
                        style={{
                          color: '#c084fc',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        View Steps
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
