import { useContent } from '../cms/ContentContext'
import { useBooking } from '../context/BookingContext'

/** Pricing tiers are sourced from the CMS — editable at /admin/pricing. */
export function HireMe() {
  const { content } = useContent()
  const { openBooking } = useBooking()

  return (
    <section className="hire" id="hire">
      <h2>Pick a package, book a session</h2>
      <p>
        No 80-item menu to scroll through. Five clear tiers, real examples behind each one, and a
        straight line from "I want this" to an invoice in your inbox.
      </p>
      <div className="tier-grid">
        {content.tiers.map((tier) => (
          <div className="tier" key={tier.id}>
            <div className="tier-name">{tier.name}</div>
            <div className="tier-price">{tier.price}</div>
            <ul>
              {tier.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {/* Opens the booking modal with this tier already selected */}
            <button type="button" className="tier-cta" onClick={() => openBooking(tier.name)}>
              Book a slot
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
