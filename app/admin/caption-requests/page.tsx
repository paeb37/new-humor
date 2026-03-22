import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CaptionRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; id?: string }>
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
  const searchId = params.id
  const pageSize = 50
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('caption_requests')
    .select(
      `
      *,
      profiles!profile_id(email),
      images!image_id(url, image_description)
    `,
      { count: 'exact' }
    )

  if (searchId) {
    query = query.eq('id', searchId)
  }

  const { data: captionRequests, count } = await query
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
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Caption Requests</h1>
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
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Total Requests</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {count?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        {searchId && (
          <div style={{ marginBottom: '1rem', color: '#d4d4d8', fontSize: '0.9rem' }}>
            Filtering for request ID <strong>{searchId}</strong>.{' '}
            <Link href="/admin/caption-requests" style={{ color: '#c084fc' }}>
              Clear filter
            </Link>
          </div>
        )}

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
                  {['ID', 'User', 'Image', 'Created'].map((h) => (
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
                {captionRequests?.map((req: any) => (
                  <tr
                    key={req.id}
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <td style={{ color: '#f4f4f5', padding: '1rem' }}>{req.id}</td>
                    <td style={{ color: '#d4d4d8', padding: '1rem' }}>
                      {req.profiles?.email || '—'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {req.images?.url ? (
                        <img
                          src={req.images.url}
                          alt=""
                          style={{
                            width: 36,
                            height: 36,
                            objectFit: 'cover',
                            borderRadius: '6px',
                          }}
                        />
                      ) : (
                        <span style={{ color: '#a1a1aa' }}>—</span>
                      )}
                    </td>
                    <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                      {req.created_datetime_utc
                        ? new Date(req.created_datetime_utc).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
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
                href={`/admin/caption-requests?page=${currentPage - 1}`}
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
                href={`/admin/caption-requests?page=${currentPage + 1}`}
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
