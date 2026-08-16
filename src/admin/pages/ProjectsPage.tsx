import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '../../cms/ContentContext'
import type { ProjectCategory, ProjectColor, ProjectItem } from '../../cms/types'
import { AdminModal } from '../components/AdminModal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { ImageUploader } from '../components/ImageUploader'
import { useToast } from '../components/Toast'

type FormState = Omit<ProjectItem, 'id'>

const EMPTY: FormState = {
  title: '',
  category: 'product',
  categoryLabel: '',
  description: '',
  colorClass: 'p1',
  coverImage: '',
  link: '',
  featured: false,
  published: true,
}

const CATEGORIES: ProjectCategory[] = ['product', 'tools', 'creative']
const COLORS: ProjectColor[] = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']

export function ProjectsPage() {
  const { content, addProject, updateProject, deleteProject } = useContent()
  const { showToast } = useToast()

  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function openNew() {
    setForm(EMPTY)
    setEditingId('new')
  }

  function openEdit(project: ProjectItem) {
    const { id, ...rest } = project
    setForm(rest)
    setEditingId(id)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (editingId === 'new') {
      addProject(form)
      showToast('Project created.')
    } else if (editingId) {
      updateProject(editingId, form)
      showToast('Project updated.')
    }
    setEditingId(null)
  }

  function handleDelete() {
    if (!deletingId) return
    deleteProject(deletingId)
    showToast('Project deleted.', 'error')
    setDeletingId(null)
  }

  function togglePublished(project: ProjectItem) {
    const { id, ...rest } = project
    updateProject(id, { ...rest, published: !rest.published })
    showToast(rest.published ? 'Unpublished.' : 'Published.')
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Projects</h1>
        <button type="button" className="btn btn-solid" onClick={openNew}>
          + New project
        </button>
      </div>

      {content.projects.length === 0 ? (
        <EmptyState message="No projects yet — add your first one." />
      ) : (
        <div className="admin-list">
          {content.projects.map((project) => (
            <div className="admin-list-row" key={project.id}>
              <div className="admin-list-main">
                <span className="admin-list-title">
                  {project.title} {project.featured && <span className="admin-featured-star">★</span>}
                </span>
                <span className="admin-list-sub">{project.categoryLabel} · {project.category}</span>
              </div>
              <StatusBadge published={project.published} />
              <div className="admin-list-actions">
                <button type="button" className="admin-link-btn" onClick={() => openEdit(project)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="admin-link-btn"
                  onClick={() => togglePublished(project)}
                >
                  {project.published ? 'Unpublish' : 'Publish'}
                </button>
                <button type="button" className="admin-link-btn admin-danger" onClick={() => setDeletingId(project.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <AdminModal title={editingId === 'new' ? 'New project' : 'Edit project'} onClose={() => setEditingId(null)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="field">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Category label (shown on the card)</label>
                <input required value={form.categoryLabel} onChange={(e) => setForm({ ...form, categoryLabel: e.target.value })} />
              </div>
            </div>

            <div className="field">
              <label>Description</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Card color (used when there's no cover image)</label>
                <select value={form.colorClass} onChange={(e) => setForm({ ...form, colorClass: e.target.value as ProjectColor })}>
                  {COLORS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Live / GitHub URL (optional)</label>
                <input value={form.link ?? ''} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </div>
            </div>

            <ImageUploader
              label="Cover image (optional — falls back to the gradient color above)"
              value={form.coverImage}
              onChange={(v) => setForm({ ...form, coverImage: v })}
            />

            <div className="field-row admin-checkbox-row">
              <label className="admin-checkbox">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured
              </label>
              <label className="admin-checkbox">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                Published
              </label>
            </div>

            <button type="submit" className="btn btn-solid modal-submit">
              {editingId === 'new' ? 'Create project' : 'Save changes'}
            </button>
          </form>
        </AdminModal>
      )}

      {deletingId && (
        <ConfirmDialog
          title="Delete project?"
          body="This can't be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
