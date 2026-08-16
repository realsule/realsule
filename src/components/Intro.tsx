import { useContent } from '../cms/ContentContext'

/** Short bio + a 2x2 stat grid — both editable from /admin/site-content. */
export function Intro() {
  const { content } = useContent()
  const { introTag, introText, stats } = content.hero

  return (
    <section className="intro">
      <div>
        <span className="intro-tag">{introTag}</span>
        <p className="intro-text">{introText}</p>
      </div>
      <div className="intro-stats">
        {stats.map((stat) => (
          <div className="stat" key={stat.id}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
