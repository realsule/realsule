import { Link } from 'react-router-dom'
import { useContent } from '../../cms/ContentContext'
import { useViewCountValue } from '../../cms/useLocalViewCount'

export function Dashboard() {
  const { content } = useContent()
  const views = useViewCountValue()

  const publishedProjects = content.projects.filter((p) => p.published).length
  const draftProjects = content.projects.length - publishedProjects
  const publishedBlog = content.blog.filter((b) => b.published).length
  const publishedGallery = content.gallery.filter((g) => g.published).length

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <p className="admin-page-lead">
        Everything here lives in this browser's storage — see the note in Settings before you
        assume an edit is "live" for every visitor.
      </p>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-value">{content.projects.length}</span>
          <span className="admin-stat-label">Projects</span>
          <span className="admin-stat-sub">{publishedProjects} published · {draftProjects} draft</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{content.blog.length}</span>
          <span className="admin-stat-label">Blog posts</span>
          <span className="admin-stat-sub">{publishedBlog} published</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{content.gallery.length}</span>
          <span className="admin-stat-label">Creative work</span>
          <span className="admin-stat-sub">{publishedGallery} published</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{views}</span>
          <span className="admin-stat-label">Views (this browser)</span>
          <span className="admin-stat-sub">Local only — see Settings</span>
        </div>
      </div>

      <h2 className="admin-section-heading">Quick actions</h2>
      <div className="admin-quick-actions">
        <Link to="/admin/projects" className="btn btn-solid">
          + New project
        </Link>
        <Link to="/admin/blog" className="btn btn-outline">
          + New blog post
        </Link>
        <Link to="/admin/gallery" className="btn btn-outline">
          + New creative work
        </Link>
      </div>
    </div>
  )
}
