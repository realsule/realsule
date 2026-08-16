import { useContent } from '../cms/ContentContext'
import { useBooking } from '../context/BookingContext'
import { useRecordedViewCount } from '../cms/useLocalViewCount'
import { QuickContact } from './QuickContact'

/** Closing CTA section. "Start a booking" opens the same modal as the tier cards. */
export function Contact() {
  const { openBooking } = useBooking()
  const { content } = useContent()
  const { contactHeadingLine, contactMark, contactBody, sayHiLead } = content.hero

  return (
    <section className="contact" id="contact">
      {/*
        Two-line heading: the coral "mark" is its own block-level line
        (not an inline span squeezed under tight line-height), which is
        what was causing it to visually clip into the line above.
      */}
      <h2 className="contact-heading">
        <span className="contact-heading-line">{contactHeadingLine}</span>
        <span className="mark">{contactMark}</span>
      </h2>
      <p>{contactBody}</p>
      <button type="button" className="btn btn-solid" onClick={() => openBooking()}>
        Start a booking
      </button>

      {/* Lower-commitment option for people who just want to say hi,
          not fill out a project brief. */}
      <p className="say-hi-lead">{sayHiLead}</p>
      <QuickContact />
    </section>
  )
}

export function Footer() {
  const { content } = useContent()

  // The one place useRecordedViewCount() is called -- see the big
  // comment in cms/useLocalViewCount.ts for why the admin Dashboard
  // deliberately uses a different, non-incrementing hook instead.
  const views = useRecordedViewCount()

  return (
    <div className="footer">
      <div className="footer-top">
        <div className="logo">{content.hero.name}</div>
        <div>{content.settings.footerTagline}</div>
        <QuickContact compact />
        <div>
          <a href="#work">Work</a> &nbsp;·&nbsp; <a href="#hire">Hire Me</a> &nbsp;·&nbsp;{' '}
          <a href="#contact">Contact</a>
        </div>
      </div>

      {/*
        Honest framing matters here -- see the comment in
        useLocalViewCount.ts. This counts page loads in each visitor's
        own browser, not real unique traffic across everyone who's ever
        visited (that needs a server). It's a fun, truthful little
        detail rather than a real analytics claim.
      */}
      <div className="footer-views">
        👁 {views.toLocaleString()} {views === 1 ? 'view' : 'views'} on this device
      </div>
    </div>
  )
}
