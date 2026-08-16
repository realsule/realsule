import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '../../cms/ContentContext'
import type { ServiceItem } from '../../cms/types'
import { AdminModal } from '../components/AdminModal'
import { useToast } from '../components/Toast'

type FormState = Pick<ServiceItem, 'title' | 'description' | 'tagLabel' | 'tagQuote'>

/** Same fixed-slot pattern as PricingPage — 5 numbered sections, edit-in-place only. */
export function ServicesPage() {
  const { content, updateService } = useContent()
  const { showToast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ title: '', description: '', tagLabel: '', tagQuote: '' })

  function openEdit(service: ServiceItem) {
    const { title, description, tagLabel, tagQuote } = service
    setForm({ title, description, tagLabel, tagQuote })
    setEditingId(service.id)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!editingId) return
    const current = content.services.find((s) => s.id === editingId)
    if (!current) return
    updateService(editingId, { ...current, ...form })
    showToast('Service updated.')
    setEditingId(null)
  }

  return (
    <div className="admin-page">
      <h1>Services pipeline</h1>
      <p className="admin-page-lead">The 5 numbered steps shown between the intro and your project grid.</p>

      <div className="admin-list">
        {content.services.map((service) => (
          <div className="admin-list-row" key={service.id}>
            <div className="admin-list-main">
              <span className="admin-list-title">{service.number} · {service.title}</span>
              <span className="admin-list-sub">{service.tagLabel}</span>
            </div>
            <div className="admin-list-actions">
              <button type="button" className="admin-link-btn" onClick={() => openEdit(service)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <AdminModal title="Edit service step" onClose={() => setEditingId(null)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="field">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Tag label</label>
                <input required value={form.tagLabel} onChange={(e) => setForm({ ...form, tagLabel: e.target.value })} />
              </div>
              <div className="field">
                <label>Tag quote ("Because…")</label>
                <input required value={form.tagQuote} onChange={(e) => setForm({ ...form, tagQuote: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-solid modal-submit">Save changes</button>
          </form>
        </AdminModal>
      )}
    </div>
  )
}
