import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LLMPromptChainsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const currentPage = Number(params.page || '1')
  const pageSize = 20
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  const { data: chains, count } = await supabase
    .from('llm_prompt_chains')
    .select(
      `
      *,
      caption_requests(id, image_id, profile_id)
    `,
      { count: 'exact' }
    )
    .order('created_datetime_utc', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / pageSize)

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
              LLM Prompt Chains
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
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Total Chains</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {count?.toLocaleString() || 0}
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
                  {['ID', 'Caption Request ID', 'Created', 'Request'].map((h) => (
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
                {chains?.map(
                  (chain: {
                    id: number
                    caption_request_id: number | null
                    created_datetime_utc: string
                    caption_requests?: { id: number } | null
                  }) => (
                  <tr
                    key={chain.id}
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <td style={{ color: '#f4f4f5', padding: '1rem' }}>{chain.id}</td>
                    <td style={{ color: '#d4d4d8', padding: '1rem' }}>
                      {chain.caption_request_id ?? '-'}
                    </td>
                    <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                      {chain.created_datetime_utc
                        ? new Date(chain.created_datetime_utc).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {chain.caption_requests && chain.caption_request_id ? (
                        <Link
                          href={`/admin/caption-requests?id=${chain.caption_request_id}`}
                          style={{
                            color: '#c084fc',
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                        >
                          View Request
                        </Link>
                      ) : (
                        <span style={{ color: '#71717a' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              alignItems: 'center',
              marginTop: '2rem',
            }}
          >
            {currentPage > 1 && (
              <Link
                href={`/admin/llm-prompt-chains?page=${currentPage - 1}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#f4f4f5',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                &larr; Previous
              </Link>
            )}
            <span style={{ color: '#a1a1aa', padding: '0 1rem' }}>
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/admin/llm-prompt-chains?page=${currentPage + 1}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#f4f4f5',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                Next &rarr;
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
