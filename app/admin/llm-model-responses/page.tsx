import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function LLMModelResponsesPage({ searchParams }: PageProps) {
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

  const { data: responses, count } = await supabase
    .from('llm_model_responses')
    .select(
      `
      *,
      llm_models(name),
      llm_prompt_chains(id, caption_request_id),
      humor_flavors(id)
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
              LLM Responses
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
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Total Responses</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {count?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {(responses || []).map((response: any) => (
            <div
              key={response.id}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ color: '#f4f4f5', fontWeight: 700 }}>
                  {response.llm_models?.name || 'Unknown model'}
                </div>
                <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                  {response.created_datetime_utc
                    ? new Date(response.created_datetime_utc).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    background: 'rgba(168, 85, 247, 0.18)',
                    color: '#e9d5ff',
                    padding: '0.3rem 0.55rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                  }}
                >
                  Chain: {response.llm_prompt_chains?.id || '-'}
                </span>
                <span
                  style={{
                    background: 'rgba(20, 184, 166, 0.18)',
                    color: '#99f6e4',
                    padding: '0.3rem 0.55rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                  }}
                >
                  Request: {response.llm_prompt_chains?.caption_request_id || '-'}
                </span>
                <span
                  style={{
                    background: 'rgba(249, 115, 22, 0.18)',
                    color: '#fdba74',
                    padding: '0.3rem 0.55rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                  }}
                >
                  Flavor: {response.humor_flavors?.id || '-'}
                </span>
              </div>

              <div style={{ color: '#d4d4d8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>User prompt:</strong> {response.llm_user_prompt || '-'}
              </div>
              <div style={{ color: '#d4d4d8', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                <strong>Response:</strong> {response.llm_response_text || '-'}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            {currentPage > 1 && (
              <Link
                href={`/admin/llm-model-responses?page=${currentPage - 1}`}
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
                href={`/admin/llm-model-responses?page=${currentPage + 1}`}
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
