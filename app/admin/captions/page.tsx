import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type CaptionStats = {
  totalVotes: number
  upvotes: number
  downvotes: number
  netScore: number
}

type Caption = {
  id: number | string
  content: string
  is_public: boolean | null
  is_featured: boolean | null
  created_datetime_utc: string
  profiles: {
    email: string | null
  } | null
  images: {
    url: string | null
    image_description: string | null
  } | null
}

type CaptionVote = {
  caption_id: number | string
  vote_value: number
}

export default async function CaptionsPage({
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
  const pageSize = 50
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  const { data: rawCaptions, count } = await supabase
    .from('captions')
    .select(
      `
      *,
      profiles!profile_id(email),
      images!image_id(url, image_description)
    `,
      { count: 'exact' }
    )
    .order('created_datetime_utc', { ascending: false })
    .range(from, to)

  const captions = (rawCaptions || []) as Caption[]
  const captionIds = captions.map((caption) => caption.id)

  const { data: captionVotes } = captionIds.length
    ? await supabase
        .from('caption_votes')
        .select('caption_id, vote_value')
        .in('caption_id', captionIds)
    : { data: [] as CaptionVote[] }

  const captionStatsById = captionIds.reduce<Record<string, CaptionStats>>((acc, captionId) => {
    acc[String(captionId)] = {
      totalVotes: 0,
      upvotes: 0,
      downvotes: 0,
      netScore: 0,
    }
    return acc
  }, {})

  for (const vote of captionVotes || []) {
    const stats = captionStatsById[String(vote.caption_id)]

    if (!stats) {
      continue
    }

    stats.totalVotes += 1

    if (vote.vote_value === 1) {
      stats.upvotes += 1
      stats.netScore += 1
    } else if (vote.vote_value === -1) {
      stats.downvotes += 1
      stats.netScore -= 1
    }
  }

  const pageStats = Object.values(captionStatsById).reduce(
    (acc, stats) => {
      acc.votesOnPage += stats.totalVotes
      acc.upvotesOnPage += stats.upvotes
      acc.downvotesOnPage += stats.downvotes
      return acc
    },
    {
      captionsOnPage: captions.length,
      votesOnPage: 0,
      upvotesOnPage: 0,
      downvotesOnPage: 0,
    }
  )

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
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Caption Browser</h1>
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
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Captions on This Page</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {pageStats.captionsOnPage.toLocaleString()}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Votes on This Page</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {pageStats.votesOnPage.toLocaleString()}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Upvotes on This Page</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {pageStats.upvotesOnPage.toLocaleString()}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Downvotes on This Page</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {pageStats.downvotesOnPage.toLocaleString()}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {captions.map((caption) => {
            const stats = captionStatsById[String(caption.id)] || {
              totalVotes: 0,
              upvotes: 0,
              downvotes: 0,
              netScore: 0,
            }

            return (
              <div
                key={caption.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {caption.images?.url && (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      background: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={caption.images.url}
                      alt={caption.images.image_description || 'Image'}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: '1.25rem' }}>
                  <p
                    style={{
                      color: '#f4f4f5',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      marginBottom: '1rem',
                    }}
                  >
                    &ldquo;{caption.content}&rdquo;
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {caption.is_public && (
                      <span
                        style={{
                          background: '#14b8a6',
                          color: '#fff',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                        }}
                      >
                        PUBLIC
                      </span>
                    )}
                    {caption.is_featured && (
                      <span
                        style={{
                          background: '#eab308',
                          color: '#fff',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                        }}
                      >
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '0.75rem',
                      marginBottom: '0.9rem',
                    }}
                  >
                    {[
                      {
                        label: 'Total Votes',
                        value: stats.totalVotes,
                        displayValue: String(stats.totalVotes),
                        border: '1px solid rgba(236, 72, 153, 0.35)',
                        background: 'rgba(236, 72, 153, 0.12)',
                        color: '#f9a8d4',
                      },
                      {
                        label: 'Upvotes',
                        value: stats.upvotes,
                        displayValue: String(stats.upvotes),
                        border: '1px solid rgba(34, 197, 94, 0.35)',
                        background: 'rgba(34, 197, 94, 0.12)',
                        color: '#86efac',
                      },
                      {
                        label: 'Downvotes',
                        value: stats.downvotes,
                        displayValue: String(stats.downvotes),
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#fca5a5',
                      },
                      {
                        label: 'Net Score',
                        value: stats.netScore,
                        displayValue: stats.netScore > 0 ? `+${stats.netScore}` : String(stats.netScore),
                        border:
                          stats.netScore >= 0
                            ? '1px solid rgba(20, 184, 166, 0.35)'
                            : '1px solid rgba(245, 158, 11, 0.35)',
                        background:
                          stats.netScore >= 0
                            ? 'rgba(20, 184, 166, 0.12)'
                            : 'rgba(245, 158, 11, 0.12)',
                        color: stats.netScore >= 0 ? '#99f6e4' : '#fcd34d',
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          background: item.background,
                          border: item.border,
                          borderRadius: '12px',
                          padding: '0.75rem',
                        }}
                      >
                        <div style={{ color: '#a1a1aa', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                          {item.label}
                        </div>
                        <div style={{ color: item.color, fontSize: '1.1rem', fontWeight: 700 }}>
                          {item.displayValue}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ color: '#71717a', fontSize: '0.8rem' }}>
                    by {caption.profiles?.email || 'Unknown'} &middot;{' '}
                    {new Date(caption.created_datetime_utc).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            )
          })}
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
                href={`/admin/captions?page=${currentPage - 1}`}
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
                href={`/admin/captions?page=${currentPage + 1}`}
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
