'use client'

import { useState } from 'react'
import {
  createWhitelistEmail,
  updateWhitelistEmail,
  deleteWhitelistEmail,
} from './actions'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

type EmailRecord = {
  id: number
  email_address: string
  created_datetime_utc: string
  modified_datetime_utc: string | null
}

export default function EmailManager({
  emails,
}: {
  emails: EmailRecord[]
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEmail, setEditingEmail] = useState<EmailRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEmails = emails.filter((e) =>
    e.email_address.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search emails..."
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
          <Plus size={18} /> Add Email
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
                Email Address
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
                Modified
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
            {filteredEmails.map((email) => (
              <tr
                key={email.id}
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <td style={{ color: '#f4f4f5', padding: '1rem' }}>
                  {email.email_address}
                </td>
                <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                  {email.created_datetime_utc
                    ? new Date(email.created_datetime_utc).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )
                    : '-'}
                </td>
                <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                  {email.modified_datetime_utc
                    ? new Date(email.modified_datetime_utc).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )
                    : '-'}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setEditingEmail(email)}
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
                        if (confirm('Are you sure you want to delete this email?')) {
                          await deleteWhitelistEmail(email.id)
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
        <EmailModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (formData) => {
            const result = await createWhitelistEmail(formData)
            if (result.success) {
              setShowCreateModal(false)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}

      {editingEmail && (
        <EmailModal
          emailRecord={editingEmail}
          onClose={() => setEditingEmail(null)}
          onSubmit={async (formData) => {
            const result = await updateWhitelistEmail(editingEmail.id, formData)
            if (result.success) {
              setEditingEmail(null)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}
    </div>
  )
}

function EmailModal({
  emailRecord,
  onClose,
  onSubmit,
}: {
  emailRecord?: EmailRecord
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
}) {
  const [email_address, setEmailAddress] = useState(
    emailRecord?.email_address || ''
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('email_address', email_address)
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
          {emailRecord ? 'Edit Email' : 'Add Email'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                color: '#a1a1aa',
                fontSize: '0.9rem',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email_address}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.75rem',
                color: '#f4f4f5',
              }}
            />
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
              {emailRecord ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
