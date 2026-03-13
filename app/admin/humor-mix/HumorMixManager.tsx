'use client'

import { useState } from 'react'
import { Save, Search } from 'lucide-react'
import { updateHumorMix } from './actions'

type MixItem = {
  id: number
  caption_count: number
  created_datetime_utc: string
  humor_flavors?: {
    id: number
    slug: string | null
    description: string | null
  } | null
}

export default function HumorMixManager({ mixItems }: { mixItems: MixItem[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [draftCounts, setDraftCounts] = useState<Record<number, string>>({})
  const [savingId, setSavingId] = useState<number | null>(null)

  const filteredItems = mixItems.filter((item) => {
    const flavorText = `${item.humor_flavors?.slug || ''} ${item.humor_flavors?.description || ''}`
    return flavorText.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <Search
            size={18}
            color="#71717a"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="Search flavor mix..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              color: '#f4f4f5',
              fontSize: '0.95rem',
            }}
          />
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
              {['Flavor', 'Description', 'Caption Count', 'Created', 'Actions'].map((header) => (
                <th
                  key={header}
                  style={{
                    color: '#a1a1aa',
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const draftValue = draftCounts[item.id] ?? String(item.caption_count ?? 0)

              return (
                <tr
                  key={item.id}
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <td style={{ color: '#f4f4f5', padding: '1rem' }}>
                    {item.humor_flavors?.slug || '-'}
                  </td>
                  <td style={{ color: '#d4d4d8', padding: '1rem' }}>
                    {item.humor_flavors?.description || '-'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <input
                      type="number"
                      value={draftValue}
                      onChange={(e) =>
                        setDraftCounts((current) => ({
                          ...current,
                          [item.id]: e.target.value,
                        }))
                      }
                      style={{
                        width: '120px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.75rem',
                        color: '#f4f4f5',
                      }}
                    />
                  </td>
                  <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                    {item.created_datetime_utc
                      ? new Date(item.created_datetime_utc).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={async () => {
                        const parsedValue = parseInt(draftValue, 10)
                        if (Number.isNaN(parsedValue)) {
                          alert('Caption count must be a number.')
                          return
                        }

                        setSavingId(item.id)
                        const result = await updateHumorMix(item.id, parsedValue)
                        setSavingId(null)

                        if (result.error) {
                          alert(result.error)
                        }
                      }}
                      disabled={savingId === item.id}
                      style={{
                        background: '#a855f7',
                        color: '#fff',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        opacity: savingId === item.id ? 0.7 : 1,
                      }}
                    >
                      <Save size={14} />
                      {savingId === item.id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
