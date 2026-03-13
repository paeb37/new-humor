'use client'

import { useState } from 'react'
import {
  createCaptionExample,
  updateCaptionExample,
  deleteCaptionExample,
} from './actions'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

type CaptionExample = {
  id: number
  image_description: string
  caption: string
  explanation: string
  priority: number
  image_id: string | null
  created_datetime_utc: string
  modified_datetime_utc: string | null
}

export default function ExampleManager({ examples }: { examples: CaptionExample[] }) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingExample, setEditingExample] = useState<CaptionExample | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredExamples = examples.filter(
    (ex) =>
      ex.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.image_description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            placeholder="Search caption or image description..."
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
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={18} /> Add Example
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredExamples.map((ex) => (
          <div
            key={ex.id}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.25rem',
            }}
          >
            <div style={{ color: '#f4f4f5', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              &ldquo;{ex.caption.length > 120 ? ex.caption.slice(0, 120) + '…' : ex.caption}&rdquo;
            </div>
            <div
              style={{
                color: '#d4d4d8',
                fontSize: '0.85rem',
                marginBottom: '0.5rem',
                maxHeight: '2.5em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {ex.image_description.length > 100
                ? ex.image_description.slice(0, 100) + '…'
                : ex.image_description}
            </div>
            <div
              style={{
                color: '#d4d4d8',
                fontSize: '0.8rem',
                marginBottom: '0.75rem',
                maxHeight: '3em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {ex.explanation.length > 80 ? ex.explanation.slice(0, 80) + '…' : ex.explanation}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span
                style={{
                  background: '#f97316',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                }}
              >
                Priority: {ex.priority}
              </span>
              {ex.image_id && (
                <span
                  style={{
                    color: '#71717a',
                    fontSize: '0.75rem',
                  }}
                >
                  {ex.image_id.slice(0, 8)}…
                </span>
              )}
            </div>
            <div
              style={{
                color: '#71717a',
                fontSize: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {ex.created_datetime_utc
                ? new Date(ex.created_datetime_utc).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '-'}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setEditingExample(ex)}
                style={{
                  background: '#a855f7',
                  color: '#fff',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this example?')) {
                    await deleteCaptionExample(ex.id)
                  }
                }}
                style={{
                  background: '#f43f5e',
                  color: '#fff',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <ExampleModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (formData) => {
            const result = await createCaptionExample(formData)
            if (result.success) {
              setShowCreateModal(false)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}

      {editingExample && (
        <ExampleModal
          example={editingExample}
          onClose={() => setEditingExample(null)}
          onSubmit={async (formData) => {
            const result = await updateCaptionExample(editingExample.id, formData)
            if (result.success) {
              setEditingExample(null)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}
    </div>
  )
}

function ExampleModal({
  example,
  onClose,
  onSubmit,
}: {
  example?: CaptionExample
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
}) {
  const [image_description, setImageDescription] = useState(example?.image_description || '')
  const [caption, setCaption] = useState(example?.caption || '')
  const [explanation, setExplanation] = useState(example?.explanation || '')
  const [priority, setPriority] = useState(example?.priority ?? 0)
  const [image_id, setImageId] = useState(example?.image_id || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image_description', image_description)
    formData.append('caption', caption)
    formData.append('explanation', explanation)
    formData.append('priority', String(priority))
    formData.append('image_id', image_id)
    await onSubmit(formData)
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '0.75rem',
    color: '#f4f4f5' as const,
  }
  const labelStyle = { color: '#a1a1aa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1a1025',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          maxWidth: '520px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#f4f4f5', marginBottom: '1.5rem', fontWeight: 700 }}>
          {example ? 'Edit Example' : 'Add Example'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Image description</label>
            <textarea
              value={image_description}
              onChange={(e) => setImageDescription(e.target.value)}
              rows={2}
              required
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
              required
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Explanation</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              required
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Priority</label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Image ID</label>
            <input
              type="text"
              value={image_id}
              onChange={(e) => setImageId(e.target.value)}
              placeholder="UUID or leave empty"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#f4f4f5',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {example ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
