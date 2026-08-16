import type { ContactLinksContent } from './types'

/** Turns raw stored contact fields into ready-to-click hrefs. Kept separate so both QuickContact and BookingModal build these identically. */
export function buildContactUrls(links: ContactLinksContent) {
  return {
    whatsappUrl: `https://wa.me/${links.whatsappNumber}?text=${encodeURIComponent(
      'Hey Suleiman — saw your portfolio and wanted to say hi!',
    )}`,
    linkedinUrl: links.linkedinUrl,
    emailUrl: `mailto:${links.email}`,
  }
}
