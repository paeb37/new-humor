import { createClient } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'
import { Users, ImageIcon, MessageSquare, BarChart3, ThumbsUp, ThumbsDown, Clock, Activity, ChevronRight } from 'lucide-react'

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

  const metrics = [
    { icon: <Users size={16} />, label: 'Users', value: totalUsers || 0, color: '#a855f7' },
    { icon: <ImageIcon size={16} />, label: 'Images', value: totalImages || 0, color: '#ec4899' },
    { icon: <MessageSquare size={16} />, label: 'Captions', value: totalCaptions || 0, color: '#14b8a6' },
    { icon: <BarChart3 size={16} />, label: 'Votes', value: totalVotes || 0, color: '#f97316' },
  ]

  const navLinks = [
    { href: '/admin/users', icon: <Users size={16} />, label: 'Manage Users', color: '#a855f7' },
    { href: '/admin/images', icon: <ImageIcon size={16} />, label: 'Manage Images', color: '#ec4899' },
    { href: '/admin/captions', icon: <MessageSquare size={16} />, label: 'View Captions', color: '#14b8a6' },
    { href: '/admin/caption-requests', icon: <MessageSquare size={16} />, label: 'Caption Requests', color: '#22d3ee' },
    { href: '/admin/caption-examples', icon: <MessageSquare size={16} />, label: 'Caption Examples', color: '#f97316' },
    { href: '/admin/humor-flavors', icon: <BarChart3 size={16} />, label: 'Humor Flavors', color: '#eab308' },
    { href: '/admin/humor-mix', icon: <BarChart3 size={16} />, label: 'Humor Mix', color: '#10b981' },
    { href: '/admin/terms', icon: <MessageSquare size={16} />, label: 'Terms', color: '#fb7185' },
    { href: '/admin/llm-models', icon: <Activity size={16} />, label: 'LLM Models', color: '#818cf8' },
    { href: '/admin/llm-providers', icon: <Activity size={16} />, label: 'LLM Providers', color: '#c084fc' },
    { href: '/admin/llm-prompt-chains', icon: <Activity size={16} />, label: 'Prompt Chains', color: '#38bdf8' },
    { href: '/admin/llm-model-responses', icon: <Activity size={16} />, label: 'LLM Responses', color: '#f59e0b' },
    { href: '/admin/allowed-domains', icon: <Users size={16} />, label: 'Allowed Domains', color: '#22d3ee' },
    { href: '/admin/whitelist-emails', icon: <Users size={16} />, label: 'Whitelisted Emails', color: '#06b6d4' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
          padding: '1rem 2rem',
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
            <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>
              Caption Control Center
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
              {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
        {/* 3-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 260px',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* LEFT SIDEBAR - Metrics */}
          <aside
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Overview
            </div>
            {metrics.map((m) => (
              <div
                key={m.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: m.color, display: 'flex' }}>{m.icon}</span>
                  <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>{m.label}</span>
                </div>
                <span style={{ color: '#f4f4f5', fontSize: '0.85rem', fontWeight: 600 }}>
                  {m.value.toLocaleString('en-US')}
                </span>
              </div>
            ))}
          </aside>

          {/* CENTER CONTENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Vote Distribution - compact single row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ color: '#71717a', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Votes
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#a1a1aa', fontSize: '0.82rem' }}>
                <ThumbsUp size={13} color="#6ee7b7" /> {upvotes.toLocaleString()}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#a1a1aa', fontSize: '0.82rem' }}>
                <ThumbsDown size={13} color="#fca5a5" /> {downvotes.toLocaleString()}
              </span>
              <span style={{ color: '#52525b', fontSize: '0.78rem' }}>
                {(upvotes + downvotes).toLocaleString()} total
              </span>
            </div>

            {/* Recent Signups - tight list, 5 users */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Clock size={14} color="#71717a" />
                <span style={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recent Signups
                </span>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  overflow: 'hidden',
                }}
              >
                {recentUsers?.slice(0, 5).map((u: any, i: number) => (
                  <div
                    key={u.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.75rem',
                      borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    }}
                  >
                    <span style={{ color: '#d4d4d8', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                      {u.email}
                    </span>
                    <span style={{ color: '#52525b', fontSize: '0.72rem', flexShrink: 0 }}>
                      {new Date(u.created_datetime_utc).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity - condensed rows, 5 items */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Activity size={14} color="#71717a" />
                <span style={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recent Activity
                </span>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  overflow: 'hidden',
                }}
              >
                {recentActivity?.slice(0, 5).map((caption: any, i: number) => (
                  <div
                    key={caption.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.75rem',
                      borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    }}
                  >
                    {caption.images?.url && (
                      <img
                        src={caption.images.url}
                        alt=""
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#d4d4d8', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        &ldquo;{caption.content}&rdquo;
                      </div>
                      <div style={{ color: '#52525b', fontSize: '0.7rem' }}>
                        {caption.profiles?.email} &middot;{' '}
                        {new Date(caption.created_datetime_utc).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - Navigation */}
          <aside
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Manage
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: link.color, display: 'flex' }}>{link.icon}</span>
                  <span style={{ color: '#d4d4d8', fontSize: '0.85rem' }}>{link.label}</span>
                </div>
                <ChevronRight size={14} color="#52525b" />
              </Link>
            ))}
          </aside>
        </div>
      </main>
    </div>
  )
}
