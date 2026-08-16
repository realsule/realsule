import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicSite } from './PublicSite'
import { ThemeProvider } from './context/ThemeContext'
import { ContentProvider } from './cms/ContentContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'
import { AdminGuard } from './admin/AdminGuard'
import { AdminLayout } from './admin/AdminLayout'
import { AdminLogin } from './admin/AdminLogin'
import { ToastProvider } from './admin/components/Toast'
import { Dashboard } from './admin/pages/Dashboard'
import { ProjectsPage } from './admin/pages/ProjectsPage'
import { GalleryPage } from './admin/pages/GalleryPage'
import { BlogPage } from './admin/pages/BlogPage'
import { PricingPage } from './admin/pages/PricingPage'
import { ServicesPage } from './admin/pages/ServicesPage'
import { SiteContentPage } from './admin/pages/SiteContentPage'
import { SettingsPage } from './admin/pages/SettingsPage'

/**
 * Two "apps" under one router:
 *  - "/"       -> the public one-page portfolio (PublicSite.tsx)
 *  - "/admin*" -> the Content Studio -- gated by AdminGuard, which bounces
 *                 to /admin/login if the (browser-only, see
 *                 AdminAuthContext.tsx) session flag isn't set.
 *
 * <ContentProvider> wraps both, since it's the single source of content
 * both the public pages and the admin forms read from. <ThemeProvider>
 * wraps both too -- a dark-mode choice made on the public site carries
 * over into the studio, and vice versa, since both just read the same
 * `data-theme` attribute on <html>.
 */
function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicSite />} />

            <Route
              path="/admin/*"
              element={
                <AdminAuthProvider>
                  <ToastProvider>
                    <Routes>
                      <Route path="login" element={<AdminLogin />} />
                      <Route element={<AdminGuard />}>
                        <Route element={<AdminLayout />}>
                          <Route index element={<Dashboard />} />
                          <Route path="projects" element={<ProjectsPage />} />
                          <Route path="gallery" element={<GalleryPage />} />
                          <Route path="blog" element={<BlogPage />} />
                          <Route path="pricing" element={<PricingPage />} />
                          <Route path="services" element={<ServicesPage />} />
                          <Route path="site-content" element={<SiteContentPage />} />
                          <Route path="settings" element={<SettingsPage />} />
                        </Route>
                      </Route>
                    </Routes>
                  </ToastProvider>
                </AdminAuthProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </ThemeProvider>
  )
}

export default App
