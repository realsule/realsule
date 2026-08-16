import { NavLink, Outlet } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

const NAV_SECTIONS = [
  {
    label: 'Content',
    items: [
      { to: '/admin', label: 'Dashboard', end: true },
      { to: '/admin/projects', label: 'Projects' },
      { to: '/admin/gallery', label: 'Creative Work' },
      { to: '/admin/blog', label: 'Blog' },
    ],
  },
  {
    label: 'Website',
    items: [
      { to: '/admin/pricing', label: 'Pricing' },
      { to: '/admin/services', label: 'Services' },
      { to: '/admin/site-content', label: 'About & Hero' },
      { to: '/admin/settings', label: 'Settings' },
    ],
  },
]

export function AdminLayout() {
  const { logout } = useAdminAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-logo script">
          Sule.
        </a>
        <p className="admin-sidebar-note">Content Studio</p>

        <nav className="admin-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="admin-nav-section">
              <span className="admin-nav-label">{section.label}</span>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button type="button" className="admin-nav-link admin-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
