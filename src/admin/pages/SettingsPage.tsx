import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useContent } from '../../cms/ContentContext'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useToast } from '../components/Toast'

export function SettingsPage() {
  const { content, updateSettings, updateContactLinks, exportJSON, importJSON, resetToDefaults } = useContent()
  const { showToast } = useToast()

  const [settingsForm, setSettingsForm] = useState(content.settings)
  const [contactForm, setContactForm] = useState(content.contactLinks)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleSettingsSubmit(e: FormEvent) {
    e.preventDefault()
    updateSettings(settingsForm)
    showToast('Site settings saved.')
  }

  function handleContactSubmit(e: FormEvent) {
    e.preventDefault()
    updateContactLinks(contactForm)
    showToast('Contact links saved.')
  }

  function handleExport() {
    const json = exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portfolio-content.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported. Paste this into src/cms/defaultContent.ts to make it permanent.')
  }

  function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = importJSON(String(reader.result))
      if (result.ok) showToast('Imported successfully.')
      else showToast(result.error, 'error')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="admin-page">
      <h1>Settings</h1>

      <form onSubmit={handleSettingsSubmit} className="admin-form admin-form-wide">
        <h3 className="admin-subheading">Site</h3>
        <div className="field">
          <label>Site title (browser tab)</label>
          <input required value={settingsForm.siteTitle} onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Footer tagline</label>
          <input required value={settingsForm.footerTagline} onChange={(e) => setSettingsForm({ ...settingsForm, footerTagline: e.target.value })} />
        </div>
        <div className="field">
          <label>Location line (top bar)</label>
          <input required value={settingsForm.location} onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-solid" style={{ alignSelf: 'flex-start' }}>Save site settings</button>
      </form>

      <form onSubmit={handleContactSubmit} className="admin-form admin-form-wide">
        <h3 className="admin-subheading">Contact channels</h3>
        <div className="field">
          <label>WhatsApp number (digits only, country code first — e.g. 2547XXXXXXXX)</label>
          <input required value={contactForm.whatsappNumber} onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })} />
        </div>
        <div className="field">
          <label>LinkedIn profile URL</label>
          <input required value={contactForm.linkedinUrl} onChange={(e) => setContactForm({ ...contactForm, linkedinUrl: e.target.value })} />
        </div>
        <div className="field">
          <label>Email</label>
          <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-solid" style={{ alignSelf: 'flex-start' }}>Save contact channels</button>
      </form>

      <div className="admin-form admin-form-wide">
        <h3 className="admin-subheading">Data</h3>
        <p className="admin-page-lead" style={{ marginBottom: 16 }}>
          <strong>Read this:</strong> everything you edit in this studio lives in this browser's
          storage only — it is not visible to other visitors, and it does not touch the deployed
          site. To make an edit permanent for everyone, click <strong>Export</strong> below, open
          the downloaded JSON, and paste its contents into{' '}
          <code>src/cms/defaultContent.ts</code>, then redeploy. That file is what every fresh
          visitor (and every fresh browser) actually sees.
        </p>
        <div className="admin-settings-actions">
          <button type="button" className="btn btn-outline" onClick={handleExport}>
            Export data (.json)
          </button>
          <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
            Import data (.json)
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleImportFile} />
          <button type="button" className="btn btn-outline admin-danger-btn" onClick={() => setConfirmingReset(true)}>
            Reset to defaults
          </button>
        </div>
      </div>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset all content?"
          body="This throws away every edit made in this browser and restores the original site content. This can't be undone."
          confirmLabel="Reset"
          onConfirm={() => {
            resetToDefaults()
            setConfirmingReset(false)
            showToast('Content reset to defaults.', 'error')
          }}
          onCancel={() => setConfirmingReset(false)}
        />
      )}
    </div>
  )
}
