'use client'

import { useState, type ReactNode } from 'react'
import { createModel, updateModel, deleteModel } from './actions'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

type Provider = {
  id: number
  name: string
}

type Model = {
  id: number
  name: string
  provider_model_id: string
  llm_provider_id: number
  is_temperature_supported?: boolean | null
  created_datetime_utc: string
  llm_providers?: Provider | Provider[] | null
}

export default function ModelManager({
  models,
  providers,
}: {
  models: Model[]
  providers: Provider[]
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingModel, setEditingModel] = useState<Model | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredModels = models.filter((model) => {
    const provider = Array.isArray(model.llm_providers)
      ? model.llm_providers[0]
      : model.llm_providers

    return (
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider_model_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
            placeholder="Search models..."
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
          <Plus size={18} /> Add Model
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
              {['Name', 'Provider', 'Provider Model ID', 'Temperature', 'Created', 'Actions'].map(
                (header) => (
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
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredModels.map((model) => {
              const provider = Array.isArray(model.llm_providers)
                ? model.llm_providers[0]
                : model.llm_providers

              return (
                <tr
                  key={model.id}
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <td style={{ color: '#f4f4f5', padding: '1rem' }}>{model.name}</td>
                  <td style={{ color: '#d4d4d8', padding: '1rem' }}>{provider?.name || '-'}</td>
                  <td style={{ color: '#d4d4d8', padding: '1rem' }}>
                    {model.provider_model_id || '-'}
                  </td>
                  <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                    {model.is_temperature_supported ? 'Supported' : 'Not supported'}
                  </td>
                  <td style={{ color: '#a1a1aa', padding: '1rem', fontSize: '0.85rem' }}>
                    {model.created_datetime_utc
                      ? new Date(model.created_datetime_utc).toLocaleDateString('en-US', {
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
                        onClick={() => setEditingModel(model)}
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
                          if (confirm('Are you sure you want to delete this model?')) {
                            const result = await deleteModel(model.id)
                            if (result.error) {
                              alert(result.error)
                            }
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
              )
            })}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <ModelModal
          providers={providers}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (formData) => {
            const result = await createModel(formData)
            if (result.success) {
              setShowCreateModal(false)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}

      {editingModel && (
        <ModelModal
          model={editingModel}
          providers={providers}
          onClose={() => setEditingModel(null)}
          onSubmit={async (formData) => {
            const result = await updateModel(editingModel.id, formData)
            if (result.success) {
              setEditingModel(null)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}
    </div>
  )
}

function ModelModal({
  model,
  providers,
  onClose,
  onSubmit,
}: {
  model?: Model
  providers: Provider[]
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
}) {
  const [name, setName] = useState(model?.name || '')
  const [providerModelId, setProviderModelId] = useState(model?.provider_model_id || '')
  const [llmProviderId, setLlmProviderId] = useState(String(model?.llm_provider_id || ''))
  const [isTemperatureSupported, setIsTemperatureSupported] = useState(
    model?.is_temperature_supported ?? false
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!llmProviderId) {
      alert('Select a provider.')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('provider_model_id', providerModelId)
    formData.append('llm_provider_id', llmProviderId)
    formData.append('is_temperature_supported', isTemperatureSupported.toString())
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
          {model ? 'Edit Model' : 'Add Model'}
        </h2>
        <form onSubmit={handleSubmit}>
          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </Field>
          <Field label="Provider">
            <select
              value={llmProviderId}
              onChange={(e) => setLlmProviderId(e.target.value)}
              required
              style={inputStyle}
            >
              <option value="">Select a provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Provider Model ID">
            <input
              type="text"
              value={providerModelId}
              onChange={(e) => setProviderModelId(e.target.value)}
              required
              style={inputStyle}
            />
          </Field>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                color: '#f4f4f5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isTemperatureSupported}
                onChange={(e) => setIsTemperatureSupported(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#a855f7' }}
              />
              Temperature supported
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={secondaryButtonStyle}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={primaryButtonStyle}
            >
              {model ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          color: '#a1a1aa',
          fontSize: '0.9rem',
          display: 'block',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '10px',
  padding: '0.75rem',
  color: '#f4f4f5',
}

const secondaryButtonStyle = {
  flex: 1,
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#f4f4f5',
  padding: '0.75rem',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  fontWeight: '600',
  cursor: 'pointer',
}

const primaryButtonStyle = {
  flex: 1,
  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
  color: '#fff',
  padding: '0.75rem',
  borderRadius: '10px',
  border: 'none',
  fontWeight: '600',
  cursor: 'pointer',
}
