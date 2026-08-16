import { useContent } from '../cms/ContentContext'
import { buildContactUrls } from '../cms/contactUrls'

/** Minimal inline icons so this component has zero external dependencies. */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1c1.9 1 4.1 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7C28.7 8.7 23 3 16 3zm0 23.1c-2 0-3.9-.5-5.5-1.5l-.4-.2-4 1.2 1.2-3.9-.3-.4a10.3 10.3 0 0 1-1.6-5.6C5.4 9.9 10.2 5.1 16 5.1c5.8 0 10.6 4.8 10.6 10.6 0 5.9-4.8 10.4-10.6 10.4zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M8.3 10.3H4.1V27h4.2V10.3zM6.2 4.4a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8zM27.9 27h-4.2v-8.1c0-1.9 0-4.4-2.7-4.4-2.8 0-3.2 2.1-3.2 4.3V27h-4.2V10.3h4v2.3h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.6V27z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="7" width="24" height="18" rx="3" />
      <path d="M5.5 9 16 17.5 26.5 9" />
    </svg>
  )
}

interface QuickContactProps {
  /** Compact drops the labels and just shows icon pills — used in the footer. */
  compact?: boolean
}

export function QuickContact({ compact = false }: QuickContactProps) {
  const { content } = useContent()
  const { whatsappUrl, linkedinUrl, emailUrl } = buildContactUrls(content.contactLinks)

  const links = [
    { href: whatsappUrl, label: 'WhatsApp', Icon: WhatsAppIcon, className: 'qc-whatsapp' },
    { href: linkedinUrl, label: 'LinkedIn', Icon: LinkedInIcon, className: 'qc-linkedin' },
    { href: emailUrl, label: 'Email', Icon: EmailIcon, className: 'qc-email' },
  ]

  return (
    <div className={`quick-contact ${compact ? 'compact' : ''}`}>
      {links.map(({ href, label, Icon, className }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
          className={`quick-contact-btn ${className}`}
          aria-label={`Say hi on ${label}`}
        >
          <Icon />
          {!compact && <span>{label}</span>}
        </a>
      ))}
    </div>
  )
}
