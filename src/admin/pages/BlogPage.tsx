import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '../../cms/ContentContext'
import type { BlogPostCMS } from '../../cms/types'
import { AdminModal } from '../components/AdminModal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { ImageUploader } from '../components/ImageUploader'
import { useToast } from '../components/Toast'

type FormState = Omit<BlogPostCMS, 'id'>

const EMPTY: FormState = { title: '', date: '', excerpt: '', body: '', coverImage: '', featured: false, published: false }

export function BlogPage() {
  const { content, addBlogPost, updateBlogPost, deleteBlogPost } = useContent()
  const { showToast } = useToast()

  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function openNew() {
    setForm({ ...EMPTY, date: new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) })
    setEditingId('new')
  }

  function openEdit(post: BlogPostCMS) {
    const { id, ...rest } = post
    setForm(rest)
    setEditingId(id)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (editingId === 'new') {
      addBlogPost(form)
      showToast('Post saved.')
    } else if (editingId) {
      updateBlogPost(editingId, form)
      showToast('Post updated.')
    }
    setEditingId(null)
  }

  function handleDelete() {
    if (!deletingId) return
    deleteBlogPost(deletingId)
    showToast('Post deleted.', 'error')
    setDeletingId(null)
  }

  function togglePublished(post: BlogPostCMS) {
    const { id, ...rest } = post
    updateBlogPost(id, { ...rest, published: !rest.published })
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Blog</h1>
        <button type="button" className="btn btn-solid" onClick={openNew}>
          + New post
        </button>
      </div>

      {content.blog.length === 0 ? (
        <EmptyState message="No posts yet." />
      ) : (
        <div className="admin-list">
          {content.blog.map((post) => (
            <div className="admin-list-row" key={post.id}>
              <div className="admin-list-main">
                <span className="admin-list-title">{post.title}</span>
                <span className="admin-list-sub">{post.date}</span>
              </div>
              <StatusBadge published={post.published} />
              <div className="admin-list-actions">
                <button type="button" className="admin-link-btn" onClick={() => openEdit(post)}>Edit</button>
                <button type="button" className="admin-link-btn" onClick={() => togglePublished(post)}>
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button type="button" className="admin-link-btn admin-danger" onClick={() => setDeletingId(post.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <AdminModal title={editingId === 'new' ? 'New post' : 'Edit post'} onClose={() => setEditingId(null)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="field">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="field">
              <label>Date</label>
              <input required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="field">
              <label>Excerpt (shown collapsed, on the card)</label>
              <textarea required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="field">
              <label>Full post</label>
              <textarea required rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </div>

            <ImageUploader label="Cover image (optional)" value={form.coverImage} onChange={(v) => setForm({ ...form, coverImage: v })} />

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
              {editingId === 'new' ? 'Save post' : 'Save changes'}
            </button>
          </form>
        </AdminModal>
      )}

      {deletingId && (
        <ConfirmDialog title="Delete this post?" body="This can't be undone." onConfirm={handleDelete} onCancel={() => setDeletingId(null)} />
      )}
    </div>
  )
}
