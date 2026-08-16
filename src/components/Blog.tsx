import { useMemo, useState } from 'react'
import { useContent } from '../cms/ContentContext'

/** Expandable list of posts, sourced from the CMS (editable at /admin/blog). Only published posts show here. */
export function Blog() {
  const { content } = useContent()
  const [openId, setOpenId] = useState<string | null>(null)

  const posts = useMemo(
    () =>
      content.blog
        .filter((p) => p.published)
        .sort((a, b) => Number(b.featured) - Number(a.featured)),
    [content.blog],
  )

  return (
    <section className="blog" id="blog">
      <h2>
        Notes to <span className="hl">myself</span>
      </h2>
      <p className="blog-lead">
        No comments, no algorithm — just things that make me happy or keep me going. Manage these
        at <code>/admin/blog</code>.
      </p>
      <div className="blog-list">
        {posts.map((post) => {
          const open = openId === post.id
          return (
            <article className={`blog-post ${open ? 'open' : ''}`} key={post.id}>
              <button className="blog-post-head" onClick={() => setOpenId(open ? null : post.id)}>
                <div>
                  <span className="blog-date">{post.date}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
                <span className="blog-toggle">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className="blog-body">
                  {post.coverImage && <img src={post.coverImage} alt="" className="blog-cover" />}
                  {post.body}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
