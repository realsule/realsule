import type { ServiceItem } from '../cms/types'
import { useContent } from '../cms/ContentContext'
import { ServiceIllustration } from './ServiceIllustration'

// One full-bleed, color-blocked section per pipeline step.
// Alternates left/right via CSS (:nth-child(even)) so it reads as a
// walk-through rather than a repeated card.
function ServiceSection({ service }: { service: ServiceItem }) {
  return (
    <section className={`service ${service.colorClass}`} id={`svc-${service.number}`}>
      <div className="service-copy">
        <div className="num-badge">{service.number}</div>
        <h2>{service.title}</h2>
        <p>{service.description}</p>
      </div>
      <div className="service-card">
        {/* Context-matching icon (compass/palette/camera/code/rocket) */}
        <ServiceIllustration type={service.illustration} />
        <span className="service-tag">{service.tagLabel}</span>
        <h3>{service.tagQuote}</h3>
      </div>
    </section>
  )
}

/** Text for these 5 steps is editable at /admin/services. */
export function Services() {
  const { content } = useContent()

  return (
    <>
      {content.services.map((service) => (
        <ServiceSection key={service.number} service={service} />
      ))}
    </>
  )
}
