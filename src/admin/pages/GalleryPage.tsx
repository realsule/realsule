import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '../../cms/ContentContext'
import type { GalleryItemCMS, GalleryType } from '../../cms/types'
import { AdminModal } from '../components/AdminModal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { ImageUploader } from '../components/ImageUploader'
import { useToast } from '../components/Toast'

type FormState = Omit<GalleryItemCMS, 'id'>

const EMPTY: FormState = { title: '', type: 'photo', note: '', src: '', published: true }
const TYPES: GalleryType[] = ['photo', 'video', 'design']

export function GalleryPage() {
  const { content, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useContent()
  const { showToast } = useToast()

  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function openNew() {
    setForm(EMPTY)
    setEditingId('new')
  }

  function openEdit(item: GalleryItemCMS) {
    const { id, ...rest } = item
    setForm(rest)
    setEditingId(id)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (editingId === 'new') {
      addGalleryItem(form)
      showToast('Creative work added.')
    } else if (editingId) {
      updateGalleryItem(editingId, form)
      showToast('Updated.')
    }
    setEditingId(null)
  }

  function handleDelete() {
    if (!deletingId) return
    deleteGalleryItem(deletingId)
    showToast('Deleted.', 'error')
    setDeletingId(null)
  }

  function togglePublished(item: GalleryItemCMS) {
    const { id, ...rest } = item
    updateGalleryItem(id, { ...rest, published: !rest.published })
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Creative work</h1>
        <button type="button" className="btn btn-solid" onClick={openNew}>
          + New item
        </button>
      </div>

      {content.gallery.length === 0 ? (
        <EmptyState message="Nothing here yet — add a photo, video, or design." />
      ) : (
        <div className="admin-list">
          {content.gallery.map((item) => (
            <div className="admin-list-row" key={item.id}>
              <div className="admin-list-main">
                <span className="admin-list-title">{item.title}</span>
                <span className="admin-list-sub">{item.type}{item.src ? '' : ' · placeholder'}</span>
              </div>
              <StatusBadge published={item.published} />
              <div className="admin-list-actions">
                <button type="button" className="admin-link-btn" onClick={() => openEdit(item)}>Edit</button>
                <button type="button" className="admin-link-btn" onClick={() => togglePublished(item)}>
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
                <button type="button" className="admin-link-btn admin-danger" onClick={() => setDeletingId(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <AdminModal title={editingId === 'new' ? 'New creative work' : 'Edit creative work'} onClose={() => setEditingId(null)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="field">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as GalleryType })}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Placeholder note (shown until you add media)</label>
                <input required value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
            </div>

            <ImageUploader label="Photo or video" value={form.src} onChange={(v) => setForm({ ...form, src: v })} />

            <label className="admin-checkbox">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>

            <button type="submit" className="btn btn-solid modal-submit">
              {editingId === 'new' ? 'Add' : 'Save changes'}
            </button>
          </form>
        </AdminModal>
      )}

      {deletingId && (
        <ConfirmDialog title="Delete this?" body="This can't be undone." onConfirm={handleDelete} onCancel={() => setDeletingId(null)} />
      )}
    </div>
  )
}
