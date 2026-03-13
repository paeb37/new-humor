'use client'

import { useState } from 'react'
import { createImage, updateImage, deleteImage } from './actions'
import { Plus, Pencil, Trash2, Search, Globe, Star } from 'lucide-react'

type Image = {
  id: string
  url: string | null
  image_description: string | null
  is_public: boolean
  is_common_use: boolean
  created_datetime_utc: string
  profiles?: { email: string }
  captions?: Array<{ count: number }>
}

export default function ImageManager({ images }: { images: Image[] }) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingImage, setEditingImage] = useState<Image | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredImages = images.filter(
    (img) =>
      img.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.image_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Search size={18} color="#71717a" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search images..."
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
          <Plus size={18} /> Create Image
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredImages.map((image) => (
          <div
            key={image.id}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {image.url && (
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
                  src={image.url}
                  alt={image.image_description || 'Image'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
            <div style={{ padding: '1rem' }}>
              <div style={{ color: '#d4d4d8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {image.image_description || 'No description'}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                {image.is_public && (
                  <span
                    style={{
                      background: '#14b8a6',
                      color: '#fff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Globe size={10} /> PUBLIC
                  </span>
                )}
                {image.is_common_use && (
                  <span
                    style={{
                      background: '#f97316',
                      color: '#fff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Star size={10} /> COMMON USE
                  </span>
                )}
                <span
                  style={{
                    background: '#ec4899',
                    color: '#fff',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                  }}
                >
                  {image.captions?.[0]?.count || 0} captions
                </span>
              </div>
              <div style={{ color: '#71717a', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                by {image.profiles?.email || 'Unknown'} &middot;{' '}
                {new Date(image.created_datetime_utc).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setEditingImage(image)}
                  style={{
                    flex: 1,
                    background: '#a855f7',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this image?')) {
                      const result = await deleteImage(image.id)
                      if (result.error) {
                        alert(result.error)
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    background: '#f43f5e',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <ImageModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (formData) => {
            const result = await createImage(formData)
            if (result.success) {
              setShowCreateModal(false)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}

      {editingImage && (
        <ImageModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSubmit={async (formData) => {
            const result = await updateImage(editingImage.id, formData)
            if (result.success) {
              setEditingImage(null)
            } else if (result.error) {
              alert(result.error)
            }
          }}
        />
      )}
    </div>
  )
}

function ImageModal({
  image,
  onClose,
  onSubmit,
}: {
  image?: Image
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
}) {
  const [url, setUrl] = useState(image?.url || '')
  const [description, setDescription] = useState(image?.image_description || '')
  const [isPublic, setIsPublic] = useState(image?.is_public ?? false)
  const [isCommonUse, setIsCommonUse] = useState(image?.is_common_use ?? false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim() && !imageFile && !image?.url) {
      setError('Provide an image URL or upload a file.')
      return
    }

    setError('')
    const formData = new FormData()
    formData.append('url', url.trim())
    formData.append('description', description)
    formData.append('is_public', isPublic.toString())
    formData.append('is_common_use', isCommonUse.toString())
    if (imageFile) {
      formData.append('image_file', imageFile)
    }
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
          {image ? 'Edit Image' : 'Create Image'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const nextFile = e.target.files?.[0] || null
                setImageFile(nextFile)
                if (nextFile) {
                  setError('')
                }
              }}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#f4f4f5',
              }}
            />
            <div style={{ color: '#71717a', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              Upload a file for Supabase Storage, or paste a URL below.
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
              Image URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
          {error && (
            <div style={{ color: '#fb7185', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            <label style={{ color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#a855f7' }}
              />
              Public
            </label>
            <label style={{ color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isCommonUse}
                onChange={(e) => setIsCommonUse(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#a855f7' }}
              />
              Common Use
            </label>
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
                border: '1px solid rgba(255, 255, 255, 0.1)',
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
              {image ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
