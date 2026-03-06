import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ImageManager from './ImageManager'

export default async function ImagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: rawImages } = await supabase
    .from('images')
    .select(`
      *,
      profiles(email),
      captions(id)
    `)
    .order('created_datetime_utc', { ascending: false })

  const images = (rawImages || []).map((image: any) => ({
    ...image,
    captions: [{ count: image.captions?.length || 0 }],
  }))

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
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Image Management</h1>
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
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Total Images</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {images?.length || 0}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Public Images</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {images?.filter((i) => i.is_public).length || 0}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Common Use</div>
            <div style={{ color: '#f4f4f5', fontSize: '2rem', fontWeight: 'bold' }}>
              {images?.filter((i) => i.is_common_use).length || 0}
            </div>
          </div>
        </div>

        <ImageManager images={images || []} />
      </main>
    </div>
  )
}
