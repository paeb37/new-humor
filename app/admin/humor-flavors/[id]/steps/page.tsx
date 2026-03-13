import { createClient } from '../../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function HumorFlavorStepsDetailPage({ params }: PageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  const { data: flavor } = await supabase
    .from('humor_flavors')
    .select('*')
    .eq('id', id)
    .single()

  const { data: steps } = await supabase
    .from('humor_flavor_steps')
    .select(
      `
      *,
      humor_flavor_step_types(slug, description),
      llm_models(name),
      llm_input_types(slug, description),
      llm_output_types(slug, description)
    `
    )
    .eq('humor_flavor_id', id)
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
              href="/admin/humor-flavors"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              &larr; Back to Humor Flavors
            </Link>
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>
              Humor Flavor Steps
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.35rem' }}>
              {flavor?.slug || `Flavor ${id}`}
            </p>
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
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Flavor</div>
            <div style={{ color: '#f4f4f5', fontSize: '1.15rem', fontWeight: 'bold' }}>
              {flavor?.slug || id}
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
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Total Steps</div>
            <div style={{ color: '#f4f4f5', fontSize: '1.15rem', fontWeight: 'bold' }}>
              {steps?.length || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {(steps || []).map((step: any) => (
            <div
              key={step.id}
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
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ color: '#f4f4f5', fontWeight: 700 }}>
                  Step {step.order_by ?? '-'}: {step.humor_flavor_step_types?.slug || 'Unknown type'}
                </div>
                <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                  Model: {step.llm_models?.name || '-'}
                </div>
              </div>

              <div style={{ color: '#d4d4d8', marginBottom: '0.75rem' }}>
                {step.description || 'No description'}
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
                  Input: {step.llm_input_types?.slug || '-'}
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
                  Output: {step.llm_output_types?.slug || '-'}
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
                  Temperature: {step.llm_temperature ?? '-'}
                </span>
              </div>

              <div style={{ color: '#a1a1aa', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                <strong>System prompt:</strong> {step.llm_system_prompt || '-'}
              </div>
              <div
                style={{
                  color: '#a1a1aa',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                  marginTop: '0.75rem',
                }}
              >
                <strong>User prompt:</strong> {step.llm_user_prompt || '-'}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
