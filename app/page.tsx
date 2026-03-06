import { createClient } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'
import { Users, ImageIcon, MessageSquare, BarChart3, ThumbsUp, ThumbsDown, Clock, Activity } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [
    { count: totalUsers },
    { count: totalImages },
    { count: totalCaptions },
    { count: totalVotes },
    { data: recentUsers },
    { data: recentActivity },
    { count: upvotesCount },
    { count: downvotesCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('images').select('*', { count: 'exact', head: true }),
    supabase.from('captions').select('*', { count: 'exact', head: true }),
    supabase.from('caption_votes').select('*', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('id, email, created_datetime_utc, is_superadmin, is_in_study')
      .order('created_datetime_utc', { ascending: false })
      .limit(10),
    supabase
      .from('captions')
      .select('id, content, created_datetime_utc, profiles(email), images(url)')
      .order('created_datetime_utc', { ascending: false })
      .limit(10),
    supabase
      .from('caption_votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_value', 1),
    supabase
      .from('caption_votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_value', -1),
  ])

  const upvotes = upvotesCount || 0
  const downvotes = downvotesCount || 0

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
            <h1 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.25rem', fontWeight: 700 }}>
              Caption Control Center
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Logged in as {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard
            icon={<Users size={28} />}
            title="Total Users"
            value={totalUsers || 0}
            color="#a855f7"
          />
          <StatCard
            icon={<ImageIcon size={28} />}
            title="Total Images"
            value={totalImages || 0}
            color="#ec4899"
          />
          <StatCard
            icon={<MessageSquare size={28} />}
            title="Total Captions"
            value={totalCaptions || 0}
            color="#14b8a6"
          />
          <StatCard
            icon={<BarChart3 size={28} />}
            title="Total Votes"
            value={totalVotes || 0}
            color="#f97316"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <NavCard
            href="/admin/users"
            icon={<Users size={32} />}
            title="Manage Users"
            description="View user profiles and activity"
            color="#a855f7"
          />
          <NavCard
            href="/admin/images"
            icon={<ImageIcon size={32} />}
            title="Manage Images"
            description="Create, edit, and delete images"
            color="#ec4899"
          />
          <NavCard
            href="/admin/captions"
            icon={<MessageSquare size={32} />}
            title="View Captions"
            description="Browse all captions in the system"
            color="#14b8a6"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h2 style={{ color: '#f4f4f5', marginBottom: '1rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={22} color="#a855f7" /> Vote Distribution
            </h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                    padding: '1rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <ThumbsUp size={24} color="#fff" style={{ marginBottom: '0.25rem' }} />
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
                    {upvotes}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Upvotes</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                    padding: '1rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <ThumbsDown size={24} color="#fff" style={{ marginBottom: '0.25rem' }} />
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
                    {downvotes}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Downvotes</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', color: '#a1a1aa', fontSize: '0.85rem' }}>
              Total engagement: {upvotes + downvotes} votes
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h2 style={{ color: '#f4f4f5', marginBottom: '1rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={22} color="#ec4899" /> Recent Signups
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentUsers?.slice(0, 10).map((user: any) => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f4f4f5', fontSize: '0.9rem' }}>
                      {user.email}
                    </div>
                    <div style={{ color: '#71717a', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {new Date(user.created_datetime_utc).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {user.is_superadmin && (
                      <span
                        style={{
                          background: '#a855f7',
                          color: '#fff',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                        }}
                      >
                        ADMIN
                      </span>
                    )}
                    {user.is_in_study && (
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
                        STUDY
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2 style={{ color: '#f4f4f5', marginBottom: '1rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={22} color="#f97316" /> Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivity?.map((caption: any) => (
              <div
                key={caption.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  alignItems: 'center',
                }}
              >
                {caption.images?.url && (
                  <img
                    src={caption.images.url}
                    alt="Caption"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#f4f4f5', marginBottom: '0.25rem' }}>
                    &ldquo;{caption.content}&rdquo;
                  </div>
                  <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                    by {caption.profiles?.email} &middot;{' '}
                    {new Date(caption.created_datetime_utc).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode
  title: string
  value: number
  color: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            {title}
          </div>
          <div style={{ color: '#f4f4f5', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {value.toLocaleString('en-US')}
          </div>
        </div>
        <div style={{ color }}>{icon}</div>
      </div>
    </div>
  )
}

function NavCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <Link
      href={href}
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textDecoration: 'none',
        display: 'block',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ color, marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ color: '#f4f4f5', fontSize: '1.3rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.5 }}>{description}</p>
    </Link>
  )
}
