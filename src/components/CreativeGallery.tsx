import { useMemo, useState } from 'react'
import type { GalleryType } from '../cms/types'
import { useContent } from '../cms/ContentContext'

/**
 * Photo/video/design showcase, sourced from the CMS (editable at
 * /admin/gallery). Items without a real `src` still render as a
 * labeled dashed-border placeholder rather than a broken image.
 */

type Filter = GalleryType | 'all'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Everything' },
  { key: 'design', label: 'Designs' },
  { key: 'photo', label: 'Photos' },
  { key: 'video', label: 'Videos' },
]

function iconFor(type: GalleryType) {
  if (type === 'video') return '▶'
  if (type === 'photo') return '◆'
  return '✎'
}

export function CreativeGallery() {
  const { content } = useContent()
  const [active, setActive] = useState<Filter>('all')

  const visible = useMemo(() => {
    const published = content.gallery.filter((g) => g.published)
    return active === 'all' ? published : published.filter((g) => g.type === active)
  }, [content.gallery, active])

  return (
    <section className="gallery" id="creative">
      <h2>
        Creative <span className="hl2">work</span>
      </h2>
      <p className="gallery-lead">
        Designs, stills, and clips from shoots and brand work. Manage these at{' '}
        <code>/admin/gallery</code> — upload a file or paste a URL, and the placeholder disappears
        automatically.
      </p>
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
      <div className="gallery-grid">
        {visible.map((item) => (
          <div className={`gallery-item gtype-${item.type}`} key={item.id}>
            {item.src ? (
              item.type === 'video' ? (
                <video src={item.src} controls />
              ) : (
                <img src={item.src} alt={item.title} />
              )
            ) : (
              <div className="placeholder-frame">
                <span className="placeholder-icon">{iconFor(item.type)}</span>
                <span className="placeholder-note">{item.note}</span>
              </div>
            )}
            <div className="gallery-caption">
              <span className="gallery-type">{item.type}</span>
              <span>{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
