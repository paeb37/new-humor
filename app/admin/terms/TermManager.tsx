'use client'

import { useState } from 'react'
import { createTerm, updateTerm, deleteTerm } from './actions'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

type Term = {
  id: number
  term: string
  definition: string
  example: string
  priority: number
  term_type_id: number | null
  created_datetime_utc: string
  modified_datetime_utc: string | null
  term_types?: {
    id: number
    slug?: string | null
    description?: string | null
  } | null
}

type TermType = {
  id: number
  slug?: string | null
  description?: string | null
}

export default function TermManager({
  terms,
  termTypes,
}: {
  terms: Term[]
  termTypes: TermType[]
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filteredTerms = terms.filter(
    (t) =>
      (typeFilter === '' || String(t.term_type_id ?? '') === typeFilter) &&
      (t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchTerm.toLowerCase()))
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
            placeholder="Search by term or definition..."
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#f4f4f5',
            minWidth: '180px',
          }}
        >
          <option value="">All Types</option>
          {termTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.slug || type.description || `Type ${type.id}`}
            </option>
          ))}
        </select>
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
          <Plus size={18} /> Add Term
        </button>
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
              <th
                style={{
                  color: '#a1a1aa',
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Term
              </th>
              <th
                style={{
                  color: '#a1a1aa',
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Definition
              </th>
              <th
                style={{
                  color: '#a1a1aa',
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Example
              </th>
              <th
                style={{
                  color: '#a1a1aa',
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Priority
              </th>
              <th
                style={{
                  color: '#a1a1aa',
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Type
              </th>
              <th
                style={{
                  color: '#a1a1aa',
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Created
              </th>
              <th
                style={{
                  color: '#a1a1aa',
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTerms.map((t) => (
              <tr
                key={t.id}
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <td style={{ color: '#f4f4f5', padding: '1rem' }}>{t.term}</td>
                <td
                  style={{
                    color: '#d4d4d8',
                    padding: '1rem',
                    fontSize: '0.9rem',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={t.definition}
                >
                  {t.definition}
                </td>
                <td
                  style={{
                    color: '#d4d4d8',
                    padding: '1rem',
                    fontSize: '0.9rem',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={t.example}
                >
                  {t.example}
                </td>
                <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                  {t.priority}
                </td>
                <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                  {t.term_types?.slug || t.term_types?.description || t.term_type_id || '-'}
                </td>
                <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                  {t.created_datetime_utc
                    ? new Date(t.created_datetime_utc).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setEditingTerm(t)}
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
                        if (confirm('Are you sure you want to delete this term?')) {
                          await deleteTerm(t.id)
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <TermModal
          termTypes={termTypes}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (formData) => {
            const result = await createTerm(formData)
            if (result.success) {
              setShowCreateModal(false)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}

      {editingTerm && (
        <TermModal
          term={editingTerm}
          termTypes={termTypes}
          onClose={() => setEditingTerm(null)}
          onSubmit={async (formData) => {
            const result = await updateTerm(editingTerm.id, formData)
            if (result.success) {
              setEditingTerm(null)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}
    </div>
  )
}

function TermModal({
  term,
  termTypes,
  onClose,
  onSubmit,
}: {
  term?: Term
  termTypes: TermType[]
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
}) {
  const [formTerm, setFormTerm] = useState(term?.term ?? '')
  const [definition, setDefinition] = useState(term?.definition ?? '')
  const [example, setExample] = useState(term?.example ?? '')
  const [priority, setPriority] = useState(term?.priority ?? 0)
  const [term_type_id, setTermTypeId] = useState(
    term?.term_type_id !== null && term?.term_type_id !== undefined
      ? String(term.term_type_id)
      : ''
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('term', formTerm)
    formData.append('definition', definition)
    formData.append('example', example)
    formData.append('priority', String(priority))
    formData.append('term_type_id', term_type_id || '')
    await onSubmit(formData)
  }

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
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#f4f4f5', marginBottom: '1.5rem', fontWeight: 700 }}>
          {term ? 'Edit Term' : 'Add Term'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                color: '#a1a1aa',
                fontSize: '0.9rem',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Term
            </label>
            <input
              type="text"
              value={formTerm}
              onChange={(e) => setFormTerm(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#f4f4f5',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                color: '#a1a1aa',
                fontSize: '0.9rem',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Definition
            </label>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              required
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#f4f4f5',
                resize: 'vertical',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                color: '#a1a1aa',
                fontSize: '0.9rem',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Example
            </label>
            <textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              required
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#f4f4f5',
                resize: 'vertical',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                color: '#a1a1aa',
                fontSize: '0.9rem',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Priority
            </label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
              required
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#f4f4f5',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                color: '#a1a1aa',
                fontSize: '0.9rem',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Term Type
            </label>
            <select
              value={term_type_id}
              onChange={(e) => setTermTypeId(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#f4f4f5',
              }}
            >
              <option value="">None</option>
              {termTypes.map((termType) => (
                <option key={termType.id} value={termType.id}>
                  {termType.slug || termType.description || `Type ${termType.id}`}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f4f4f5',
                padding: '0.75rem',
                borderRadius: '10px',
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
              {term ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
