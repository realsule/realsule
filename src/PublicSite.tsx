import { TopBar } from './components/TopBar'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { MarqueeBand } from './components/MarqueeBand'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { CreativeGallery } from './components/CreativeGallery'
import { Games } from './components/Games'
import { CodePlayground } from './components/CodePlayground'
import { Blog } from './components/Blog'
import { HireMe } from './components/HireMe'
import { Contact, Footer } from './components/Contact'
import { BottomNav } from './components/BottomNav'
import { BookingModal } from './components/BookingModal'
import { BookingProvider } from './context/BookingContext'
import { LoadingScreen } from './components/LoadingScreen'

/**
 * The public, one-page portfolio — exactly what used to live directly in
 * App.tsx. Pulled into its own component once /admin needed to become a
 * real second route: App.tsx now decides which of these two "apps" to
 * render, and neither needs to know the other exists.
 */
export function PublicSite() {
  return (
    <BookingProvider>
      <LoadingScreen />
      <TopBar />
      <Hero />
      <Intro />
      <MarqueeBand />
      <Services />
      <Work />
      <CreativeGallery />
      <Games />
      <CodePlayground />
      <Blog />
      <HireMe />
      <Contact />
      <Footer />
      <BottomNav />
      <BookingModal />
    </BookingProvider>
  )
}
