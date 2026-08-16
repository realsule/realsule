import { useState } from 'react'

interface NavItem {
  key: string
  href: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '#home', label: 'Home' },
  { key: 'work', href: '#work', label: 'Work' },
  { key: 'creative', href: '#creative', label: 'Creative' },
  { key: 'games', href: '#games', label: 'Games' },
  { key: 'blog', href: '#blog', label: 'Blog' },
  { key: 'hire', href: '#hire', label: 'Services' },
  { key: 'contact', href: '#contact', label: 'Contact' },
]

export function BottomNav() {
  // null = fully expanded (every link visible).
  // a key = collapsed down to just the logo + that one link.
  const [activeKey, setActiveKey] = useState<string | null>(null)

  function handleNavClick(key: string) {
    // Clicking the already-active link re-expands the full nav;
    // clicking a different link collapses down to just that one.
    setActiveKey((current) => (current === key ? null : key))
  }

  function handleLogoClick() {
    // The logo always brings the full nav back.
    setActiveKey(null)
  }

  const visibleItems = activeKey ? NAV_ITEMS.filter((item) => item.key === activeKey) : NAV_ITEMS

  return (
    <nav className={`bottom-nav ${activeKey ? 'collapsed' : ''}`}>
      <a href="#home" className="logo" onClick={handleLogoClick}>
        Sule.
      </a>

      {visibleItems.map((item) => (
        <a key={item.key} href={item.href} onClick={() => handleNavClick(item.key)}>
          {item.label}
        </a>
      ))}

      {/* Hire Me pill only shows in the fully-expanded state */}
      {!activeKey && (
        <a href="#hire" className="hire-btn" onClick={() => handleNavClick('hire')}>
          Hire Me
        </a>
      )}
    </nav>
  )
}
