import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '../../cms/ContentContext'
import type { TierItem } from '../../cms/types'
import { AdminModal } from '../components/AdminModal'
import { useToast } from '../components/Toast'

type FormState = { name: string; price: string; itemsText: string }

/**
 * Tiers are a fixed 5-slot structural section (see the comment on
 * updateTier in ContentContext.tsx) — this page only supports editing
 * an existing tier in place, not adding/removing rows.
 */
export function PricingPage() {
  const { content, updateTier } = useContent()
  const { showToast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ name: '', price: '', itemsText: '' })

  function openEdit(tier: TierItem) {
    setForm({ name: tier.name, price: tier.price, itemsText: tier.items.join('\n') })
    setEditingId(tier.id)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!editingId) return
    const items = form.itemsText.split('\n').map((line) => line.trim()).filter(Boolean)
    updateTier(editingId, { name: form.name, price: form.price, items })
    showToast('Pricing updated.')
    setEditingId(null)
  }

  return (
    <div className="admin-page">
      <h1>Pricing</h1>
      <p className="admin-page-lead">
        These five tiers power the Hire Me section and the booking form's package dropdown. Prices
        are free-text, so "From KES 2,000" or "Custom quote" both work.
      </p>

      <div className="admin-list">
        {content.tiers.map((tier) => (
          <div className="admin-list-row" key={tier.id}>
            <div className="admin-list-main">
              <span className="admin-list-title">{tier.name}</span>
              <span className="admin-list-sub">{tier.price} · {tier.items.length} items</span>
            </div>
            <div className="admin-list-actions">
              <button type="button" className="admin-link-btn" onClick={() => openEdit(tier)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <AdminModal title={`Edit ${form.name}`} onClose={() => setEditingId(null)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="field">
              <label>Tier name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Price</label>
              <input required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="field">
              <label>What's included (one per line)</label>
              <textarea required rows={5} value={form.itemsText} onChange={(e) => setForm({ ...form, itemsText: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-solid modal-submit">Save changes</button>
          </form>
        </AdminModal>
      )}
    </div>
  )
}
