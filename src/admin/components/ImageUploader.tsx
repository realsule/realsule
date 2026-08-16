import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

interface ImageUploaderProps {
  label: string
  value?: string
  onChange: (value: string) => void
}

// localStorage typically caps out around 5–10MB for the whole site,
// and base64 inflates a file by roughly 33% — past a few hundred KB
// per image this fills up fast. Warn rather than silently fail.
const WARN_SIZE_BYTES = 700_000

/**
 * Two ways to set an image/video, because there's no real upload
 * server behind this:
 *   1. Pick/drop a file → read it as base64 and store the string
 *      directly in this browser's content (fine for quick local
 *      preview, but doesn't exist anywhere else — see the big comment
 *      in ContentContext.tsx).
 *   2. Paste a real URL or a `/media/...` path (for a file you've
 *      actually placed in public/media and committed) — this is the
 *      only option that works for every visitor once deployed.
 */
export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [warnSize, setWarnSize] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | undefined) {
    if (!file) return
    setWarnSize(file.size > WARN_SIZE_BYTES)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const isVideo = value?.startsWith('data:video') || /\.(mp4|webm|mov)$/i.test(value ?? '')

  return (
    <div className="field">
      <label>{label}</label>

      <div
        className={`uploader-dropzone ${dragOver ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {value ? (
          isVideo ? (
            <video src={value} className="uploader-preview" controls />
          ) : (
            <img src={value} alt="" className="uploader-preview" />
          )
        ) : (
          <span className="uploader-hint">Click or drop an image/video here</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])}
      />

      {warnSize && (
        <p className="uploader-warning">
          That file is fairly large for browser storage — fine for local preview, but for anything
          real, put the file in <code>public/media</code> and use the URL field below instead.
        </p>
      )}

      <input
        type="text"
        placeholder="…or paste a URL / /media/your-file.jpg"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <button type="button" className="uploader-clear" onClick={() => onChange('')}>
          Remove
        </button>
      )}
    </div>
  )
}
