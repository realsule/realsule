import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  BlogPostCMS,
  CmsContent,
  ContactLinksContent,
  GalleryItemCMS,
  HeroContent,
  ProjectItem,
  ServiceItem,
  SiteSettings,
  TierItem,
} from './types'
import { defaultContent } from './defaultContent'
import { makeId } from './makeId'

const STORAGE_KEY = 'suleiman-portfolio-cms-content'

/**
 * IMPORTANT — READ THIS BEFORE ASSUMING THIS IS A REAL DATABASE:
 *
 * There is no backend here. Everything below reads from and writes to
 * this ONE browser's localStorage. That means:
 *
 *   - Edits you make in /admin on your laptop do NOT appear on your
 *     phone, or in anyone else's browser, or on the live deployed site
 *     — only in the browser you edited from.
 *   - To make an edit permanent (visible to every visitor on the real
 *     deployed site), use "Export data" in /admin/settings, copy the
 *     JSON it gives you into src/cms/defaultContent.ts, and redeploy.
 *     That file IS the source of truth for what every visitor sees.
 *
 * This is the honest ceiling of a CMS with no server — a real
 * multi-device CMS needs a backend (see the README for what that would
 * take to add later, e.g. a free-tier Supabase project).
 */
function loadContent(): CmsContent {
  if (typeof window === 'undefined') return defaultContent
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultContent
    const parsed = JSON.parse(raw) as Partial<CmsContent>
    // Merge field-by-field (not a blind spread) so that if this file's
    // shape gains a new field later, an old localStorage blob missing
    // that field doesn't crash the app — it just falls back to default.
    return {
      hero: parsed.hero ?? defaultContent.hero,
      services: parsed.services ?? defaultContent.services,
      projects: parsed.projects ?? defaultContent.projects,
      gallery: parsed.gallery ?? defaultContent.gallery,
      blog: parsed.blog ?? defaultContent.blog,
      tiers: parsed.tiers ?? defaultContent.tiers,
      contactLinks: parsed.contactLinks ?? defaultContent.contactLinks,
      settings: parsed.settings ?? defaultContent.settings,
    }
  } catch {
    return defaultContent
  }
}

interface ContentContextValue {
  content: CmsContent

  updateHero: (hero: HeroContent) => void
  updateContactLinks: (links: ContactLinksContent) => void
  updateSettings: (settings: SiteSettings) => void

  addProject: (project: Omit<ProjectItem, 'id'>) => void
  updateProject: (id: string, project: Omit<ProjectItem, 'id'>) => void
  deleteProject: (id: string) => void

  addGalleryItem: (item: Omit<GalleryItemCMS, 'id'>) => void
  updateGalleryItem: (id: string, item: Omit<GalleryItemCMS, 'id'>) => void
  deleteGalleryItem: (id: string) => void

  addBlogPost: (post: Omit<BlogPostCMS, 'id'>) => void
  updateBlogPost: (id: string, post: Omit<BlogPostCMS, 'id'>) => void
  deleteBlogPost: (id: string) => void

  updateTier: (id: string, tier: Omit<TierItem, 'id'>) => void

  updateService: (id: string, service: Omit<ServiceItem, 'id'>) => void

  exportJSON: () => string
  importJSON: (json: string) => { ok: true } | { ok: false; error: string }
  resetToDefaults: () => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(loadContent)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  }, [content])

  const value = useMemo<ContentContextValue>(() => {
    return {
      content,

      updateHero: (hero) => setContent((c) => ({ ...c, hero })),
      updateContactLinks: (contactLinks) => setContent((c) => ({ ...c, contactLinks })),
      updateSettings: (settings) => setContent((c) => ({ ...c, settings })),

      addProject: (project) =>
        setContent((c) => ({ ...c, projects: [...c.projects, { ...project, id: makeId('project') }] })),
      updateProject: (id, project) =>
        setContent((c) => ({ ...c, projects: c.projects.map((p) => (p.id === id ? { ...project, id } : p)) })),
      deleteProject: (id) => setContent((c) => ({ ...c, projects: c.projects.filter((p) => p.id !== id) })),

      addGalleryItem: (item) =>
        setContent((c) => ({ ...c, gallery: [...c.gallery, { ...item, id: makeId('gallery') }] })),
      updateGalleryItem: (id, item) =>
        setContent((c) => ({ ...c, gallery: c.gallery.map((g) => (g.id === id ? { ...item, id } : g)) })),
      deleteGalleryItem: (id) => setContent((c) => ({ ...c, gallery: c.gallery.filter((g) => g.id !== id) })),

      addBlogPost: (post) => setContent((c) => ({ ...c, blog: [...c.blog, { ...post, id: makeId('post') }] })),
      updateBlogPost: (id, post) =>
        setContent((c) => ({ ...c, blog: c.blog.map((b) => (b.id === id ? { ...post, id } : b)) })),
      deleteBlogPost: (id) => setContent((c) => ({ ...c, blog: c.blog.filter((b) => b.id !== id) })),

      // Tiers/services are fixed-count structural sections (5 pricing
      // tiers, 5 pipeline steps) rather than open-ended lists, so they
      // only support editing in place — not add/delete — matching how
      // they're actually used on the public site.
      updateTier: (id, tier) =>
        setContent((c) => ({ ...c, tiers: c.tiers.map((t) => (t.id === id ? { ...tier, id } : t)) })),
      updateService: (id, service) =>
        setContent((c) => ({ ...c, services: c.services.map((s) => (s.id === id ? { ...service, id } : s)) })),

      exportJSON: () => JSON.stringify(content, null, 2),
      importJSON: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<CmsContent>
          if (!parsed || typeof parsed !== 'object') {
            return { ok: false, error: 'That JSON is not an object.' }
          }
          setContent({
            hero: parsed.hero ?? defaultContent.hero,
            services: parsed.services ?? defaultContent.services,
            projects: parsed.projects ?? defaultContent.projects,
            gallery: parsed.gallery ?? defaultContent.gallery,
            blog: parsed.blog ?? defaultContent.blog,
            tiers: parsed.tiers ?? defaultContent.tiers,
            contactLinks: parsed.contactLinks ?? defaultContent.contactLinks,
            settings: parsed.settings ?? defaultContent.settings,
          })
          return { ok: true }
        } catch {
          return { ok: false, error: "That doesn't look like valid JSON." }
        }
      },
      resetToDefaults: () => setContent(defaultContent),
    }
  }, [content])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>')
  return ctx
}
