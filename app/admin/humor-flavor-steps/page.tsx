import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HumorFlavorStepsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: steps } = await supabase
    .from('humor_flavor_steps')
    .select('id, created_datetime_utc, humor_flavor_id, order_by, description, llm_model_id, llm_temperature')
    .order('humor_flavor_id', { ascending: true })
    .order('order_by', { ascending: true })

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
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>
              Humor Flavor Steps
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
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Total Steps</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {steps?.length || 0}
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
                  {['ID', 'Flavor ID', 'Order', 'Description', 'Model ID', 'Temperature', 'Created'].map((h) => (
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
                {steps?.map((row: any) => (
                  <tr
                    key={row.id}
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <td style={{ color: '#f4f4f5', padding: '1rem' }}>{row.id}</td>
                    <td style={{ color: '#d4d4d8', padding: '1rem' }}>{row.humor_flavor_id ?? '-'}</td>
                    <td style={{ color: '#d4d4d8', padding: '1rem' }}>{row.order_by ?? '-'}</td>
                    <td
                      style={{
                        color: '#d4d4d8',
                        padding: '1rem',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.description ?? <span style={{ color: '#a1a1aa' }}>—</span>}
                    </td>
                    <td style={{ color: '#d4d4d8', padding: '1rem' }}>{row.llm_model_id ?? '-'}</td>
                    <td style={{ color: '#a1a1aa', padding: '1rem' }}>{row.llm_temperature ?? '-'}</td>
                    <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                      {row.created_datetime_utc
                        ? new Date(row.created_datetime_utc).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
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
