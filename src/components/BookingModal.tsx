import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useBooking } from '../context/BookingContext'
import { useContent } from '../cms/ContentContext'

const PROJECT_TYPES = ['Website', 'Web app / SaaS', 'Branding & design', 'Video / creative direction', 'Something else']
const TIMELINES = ['ASAP', 'Within 2 weeks', 'Within a month', 'Flexible / just exploring']

interface FormState {
  name: string
  contact: string
  package: string
  projectType: string
  timeline: string
  budget: string
  message: string
}

const emptyForm: FormState = {
  name: '',
  contact: '',
  package: '',
  projectType: PROJECT_TYPES[0],
  timeline: TIMELINES[0],
  budget: '',
  message: '',
}

export function BookingModal() {
  const { isOpen, selectedTier, closeBooking } = useBooking()
  // Both the package dropdown options and the destination email come
  // from the CMS now (Pricing page and Settings page in /admin).
  const { content } = useContent()
  const { tiers } = content
  const CONTACT_EMAIL = content.contactLinks.email
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sent, setSent] = useState(false)

  // Whenever the modal opens with a tier pre-selected (from a "Book a slot"
  // click on a pricing card), seed the package field with it.
  //
  // This only fires when `isOpen` or `selectedTier` change — NOT on every
  // render — so it won't fight the visitor if they manually pick a
  // different package from the dropdown afterwards.
  useEffect(() => {
    if (isOpen && selectedTier) {
      setForm((prev) => ({ ...prev, package: selectedTier }))
    }
  }, [isOpen, selectedTier])

  // Small polish while the modal is open: Escape closes it, and the page
  // behind it stops scrolling so the visitor isn't fighting two scroll
  // areas at once (common on mobile especially).
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBooking()
    }
    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, closeBooking])

  if (!isOpen) return null

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleClose() {
    closeBooking()
    // Reset after the close animation would run, so the form is fresh next time
    setTimeout(() => {
      setForm(emptyForm)
      setSent(false)
    }, 200)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // No backend to POST to — instead, compose a pre-filled email so the
    // request lands directly in your inbox with everything the visitor entered.
    const subject = encodeURIComponent(`New booking request${form.package ? ` — ${form.package}` : ''}`)
    const bodyLines = [
      `Name: ${form.name}`,
      `Contact: ${form.contact}`,
      `Package: ${form.package || 'Not specified'}`,
      `Project type: ${form.projectType}`,
      `Timeline: ${form.timeline}`,
      `Budget: ${form.budget || 'Not specified'}`,
      '',
      'Message:',
      form.message || '(no message)',
    ]
    const body = encodeURIComponent(bodyLines.join('\n'))
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`

    setSent(true)
  }

  return (
    // Clicking the dimmed backdrop closes the modal; clicking inside the
    // card itself must not (stopPropagation), or every click on a field
    // would bubble up and close the form.
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Book a session"
      onClick={handleClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        {sent ? (
          // Confirmation state — shown after the mailto link has been triggered
          <div className="modal-confirm">
            <h2>Request ready to send</h2>
            <p>
              Your email app should have opened with everything filled in. If it didn't, email me
              directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <button className="btn btn-solid" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Let's get you booked in</h2>
            <p className="modal-lead">A few quick prompts — takes under a minute.</p>

            <label className="field">
              <span>Your name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Jane Wanjiru"
              />
            </label>

            <label className="field">
              <span>Email or phone number</span>
              <input
                type="text"
                required
                value={form.contact}
                onChange={(e) => update('contact', e.target.value)}
                placeholder="you@email.com or +254 7xx xxx xxx"
              />
            </label>

            <label className="field">
              <span>Which package are you thinking?</span>
              <select value={form.package} onChange={(e) => update('package', e.target.value)}>
                <option value="">Not sure yet</option>
                {tiers.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.price})
                  </option>
                ))}
              </select>
            </label>

            <div className="field-row">
              <label className="field">
                <span>Project type</span>
                <select value={form.projectType} onChange={(e) => update('projectType', e.target.value)}>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Timeline</span>
                <select value={form.timeline} onChange={(e) => update('timeline', e.target.value)}>
                  {TIMELINES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>Rough budget (optional)</span>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => update('budget', e.target.value)}
                placeholder="e.g. KES 15,000 – 25,000"
              />
            </label>

            <label className="field">
              <span>Tell me a bit about the project</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="What are you trying to build, and for who?"
              />
            </label>

            <button type="submit" className="btn btn-solid modal-submit">
              Send booking request
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
