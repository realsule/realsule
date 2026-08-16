import { useMemo, useState } from 'react'
import type { ProjectCategory } from '../cms/types'
import { useContent } from '../cms/ContentContext'

/**
 * Filterable grid of shipped projects, sourced from the CMS
 * (editable at /admin/projects). Only published projects are shown
 * here — drafts stay visible in admin only. Featured projects sort
 * first within whatever filter is active.
 */

type Filter = ProjectCategory | 'all'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'product', label: 'Products & SaaS' },
  { key: 'tools', label: 'Tools' },
  { key: 'creative', label: 'Creative & Brand' },
]

export function Work() {
  const { content } = useContent()
  const [active, setActive] = useState<Filter>('all')

  const visible = useMemo(() => {
    const published = content.projects.filter((p) => p.published)
    const filtered = active === 'all' ? published : published.filter((p) => p.category === active)
    return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured))
  }, [content.projects, active])

  return (
    <section className="projects" id="work">
      <h2>
        Selected <span className="hl">work</span>
      </h2>
      <div className="filters">
        {filters.map((f) => (
          <div
            key={f.key}
            className={`filter-btn ${active === f.key ? 'active' : ''}`}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </div>
        ))}
      </div>
      <div className="proj-grid">
        {visible.map((project) => (
          <a
            key={project.id}
            className={`proj-card ${project.colorClass}`}
            style={project.coverImage ? { backgroundImage: `url(${project.coverImage})` } : undefined}
            href={project.link ?? '#'}
            target={project.link ? '_blank' : undefined}
            rel={project.link ? 'noreferrer' : undefined}
          >
            <span className="cat">{project.categoryLabel}</span>
            {project.featured && <span className="featured-badge">★ Featured</span>}
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
