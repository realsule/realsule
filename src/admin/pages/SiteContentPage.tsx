import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '../../cms/ContentContext'
import { useToast } from '../components/Toast'

export function SiteContentPage() {
  const { content, updateHero } = useContent()
  const { showToast } = useToast()
  const [form, setForm] = useState(content.hero)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    updateHero(form)
    showToast('Site content updated.')
  }

  function updateStat(index: number, field: 'value' | 'label', text: string) {
    const stats = form.stats.map((s, i) => (i === index ? { ...s, [field]: text } : s))
    setForm({ ...form, stats })
  }

  return (
    <div className="admin-page">
      <h1>About &amp; hero</h1>
      <p className="admin-page-lead">Everything in the top of the page, plus the closing "Got an idea?" CTA.</p>

      <form onSubmit={handleSubmit} className="admin-form admin-form-wide">
        <div className="field">
          <label>Eyebrow (small text above your name)</label>
          <input required value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
        </div>
        <div className="field">
          <label>Name (the big script wordmark)</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Hero tagline</label>
          <textarea required rows={2} value={form.heroRole} onChange={(e) => setForm({ ...form, heroRole: e.target.value })} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Intro tag</label>
            <input required value={form.introTag} onChange={(e) => setForm({ ...form, introTag: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Intro text</label>
          <textarea required rows={3} value={form.introText} onChange={(e) => setForm({ ...form, introText: e.target.value })} />
        </div>

        <h3 className="admin-subheading">Stats grid</h3>
        {form.stats.map((stat, i) => (
          <div className="field-row" key={stat.id}>
            <div className="field">
              <label>Value</label>
              <input required value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} />
            </div>
            <div className="field">
              <label>Label</label>
              <input required value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} />
            </div>
          </div>
        ))}

        <h3 className="admin-subheading">Closing CTA</h3>
        <div className="field-row">
          <div className="field">
            <label>Heading line</label>
            <input required value={form.contactHeadingLine} onChange={(e) => setForm({ ...form, contactHeadingLine: e.target.value })} />
          </div>
          <div className="field">
            <label>Highlighted line</label>
            <input required value={form.contactMark} onChange={(e) => setForm({ ...form, contactMark: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Body text</label>
          <textarea required rows={2} value={form.contactBody} onChange={(e) => setForm({ ...form, contactBody: e.target.value })} />
        </div>
        <div className="field">
          <label>"Say hi" lead-in text</label>
          <input required value={form.sayHiLead} onChange={(e) => setForm({ ...form, sayHiLead: e.target.value })} />
        </div>

        <button type="submit" className="btn btn-solid" style={{ alignSelf: 'flex-start' }}>
          Save
        </button>
      </form>
    </div>
  )
}
