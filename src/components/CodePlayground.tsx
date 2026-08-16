import { useState } from 'react'
import { snippets } from '../data/snippets'

/**
 * Interactive but non-executing code viewer. Visitors can edit the text
 * in each tab (plain React state, per-snippet) — nothing runs anywhere,
 * it's a personality/credibility touch, not a real sandbox.
 */

export function CodePlayground() {
  const [activeId, setActiveId] = useState(snippets[0].id)
  const [code, setCode] = useState<Record<string, string>>(
    Object.fromEntries(snippets.map((s) => [s.id, s.code])),
  )

  const lineCount = code[activeId].split('\n').length

  return (
    <section className="playground" id="playground">
      <h2>
        Poke around <span className="hl3">the code</span>
      </h2>
      <p className="playground-lead">
        These are real, editable snippets pulled from my projects — no backend involved, it's
        just plain client-side state. Click a tab, edit the text, see it change.
      </p>
      <div className="editor">
        <div className="editor-tabs">
          {snippets.map((s) => (
            <div
              key={s.id}
              className={`editor-tab ${activeId === s.id ? 'active' : ''}`}
              onClick={() => setActiveId(s.id)}
            >
              {s.label}
            </div>
          ))}
        </div>
        <div className="editor-body">
          <div className="editor-gutter" aria-hidden="true">
            {Array.from({ length: lineCount }).map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <textarea
            className="editor-textarea"
            spellCheck={false}
            value={code[activeId]}
            onChange={(e) => setCode((prev) => ({ ...prev, [activeId]: e.target.value }))}
          />
        </div>
      </div>
    </section>
  )
}
