/**
 * Every shape the admin Content Studio can create/edit/delete.
 *
 * These intentionally extend the original static shapes from src/data/*.ts
 * (same field names) plus the handful of CMS-only fields every content
 * type needs: `id`, `published`, and `featured` where it makes sense.
 * That overlap is deliberate — it's what lets ContentContext seed itself
 * from the exact content that's live today (see defaultContent.ts) with
 * zero behavior change until you actually edit something in /admin.
 */

export type ProjectCategory = 'product' | 'tools' | 'creative'
export type ProjectColor = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6'

export interface ProjectItem {
  id: string
  title: string
  category: ProjectCategory
  categoryLabel: string
  description: string
  colorClass: ProjectColor
  /** Optional real image — falls back to the colorClass gradient when empty. */
  coverImage?: string
  link?: string
  featured: boolean
  published: boolean
}

export type GalleryType = 'photo' | 'video' | 'design'

export interface GalleryItemCMS {
  id: string
  title: string
  type: GalleryType
  note: string
  src?: string
  published: boolean
}

export interface BlogPostCMS {
  id: string
  title: string
  date: string
  excerpt: string
  body: string
  coverImage?: string
  featured: boolean
  published: boolean
}

export type IllustrationType = 'compass' | 'palette' | 'camera' | 'code' | 'rocket'
export type ServiceColor = 'svc1' | 'svc2' | 'svc3' | 'svc4' | 'svc5'

export interface ServiceItem {
  id: string
  number: string
  title: string
  description: string
  tagLabel: string
  tagQuote: string
  colorClass: ServiceColor
  illustration: IllustrationType
}

export interface TierItem {
  id: string
  name: string
  price: string
  items: string[]
}

export interface ContactLinksContent {
  whatsappNumber: string
  linkedinUrl: string
  email: string
}

export interface AboutStat {
  id: string
  value: string
  label: string
}

export interface HeroContent {
  eyebrow: string
  name: string
  heroRole: string
  introTag: string
  introText: string
  stats: AboutStat[]
  contactHeadingLine: string
  contactMark: string
  contactBody: string
  sayHiLead: string
}

export interface SiteSettings {
  siteTitle: string
  footerTagline: string
  location: string
}

/** The full shape persisted as one object in localStorage. */
export interface CmsContent {
  hero: HeroContent
  services: ServiceItem[]
  projects: ProjectItem[]
  gallery: GalleryItemCMS[]
  blog: BlogPostCMS[]
  tiers: TierItem[]
  contactLinks: ContactLinksContent
  settings: SiteSettings
}
