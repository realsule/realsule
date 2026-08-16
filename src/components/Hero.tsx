import { useContent } from '../cms/ContentContext'

/** Top-of-page introduction: name, one-line pitch, and the two primary CTAs. */
export function Hero() {
  const { content } = useContent()
  const { eyebrow, name, heroRole } = content.hero

  return (
    <section className="hero" id="home">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="hero-name script">{name}</h1>
      <p className="hero-role">{heroRole}</p>
      <div className="hero-cta">
        <a href="#hire" className="btn btn-solid">
          Hire Me
        </a>
        <a href="#work" className="btn btn-outline">
          See the work
        </a>
      </div>
    </section>
  )
}
