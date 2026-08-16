import { useContent } from '../cms/ContentContext'
import { ThemeToggle } from './ThemeToggle'
import { QuickContact } from './QuickContact'

/** Thin strip above the hero -- location (editable in /admin/settings), theme toggle, and quick-contact icons. */
export function TopBar() {
  const { content } = useContent()

  return (
    <div className="topbar">
      <div>{content.settings.location}</div>
      <div className="topbar-right">
        <QuickContact compact />
        <ThemeToggle />
        <div className="pills">
          <span>Code</span>
          <span>Creative Direction</span>
        </div>
      </div>
    </div>
  )
}
