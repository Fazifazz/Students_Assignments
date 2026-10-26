import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

type ProfileEditFormProps = {
  displayName: string
  email: string
  profileImage: string | null
  onClose: () => void
  onSave: (displayName: string, email: string, profileImage: string | null) => void
}

export function ProfileEditForm({ displayName, email, profileImage, onClose, onSave }: ProfileEditFormProps) {
  const [name, setName] = useState(displayName)
  const [profileEmail, setProfileEmail] = useState(email)
  const [image, setImage] = useState(profileImage)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    if (!normalizedName) {
      setError('Enter your display name.')
      return
    }
    onSave(normalizedName, profileEmail.trim(), image)
  }

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > 1024 * 1024) {
      setError('Choose an image smaller than 1 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setError('The selected image could not be read.')
        return
      }
      setImage(reader.result)
      setError(null)
    }
    reader.onerror = () => setError('The selected image could not be read.')
    reader.readAsDataURL(file)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="invoice-modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <header className="modal-header">
          <div><span className="section-kicker">YOUR ACCOUNT</span><h2 id="profile-title">Edit profile</h2><p>Update how your profile appears in Ledgerly.</p></div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        </header>
        <form onSubmit={submit}>
          <div className="profile-preview">
            <span className="profile-preview-avatar">
              {image
                ? <img src={image} alt="Profile preview" />
                : name.trim().charAt(0).toUpperCase() || '?'}
            </span>
            <span><strong>{name.trim() || 'Your name'}</strong><small>Username: faith</small></span>
          </div>
          <div className="profile-photo-actions">
            <label className="secondary-button profile-photo-upload">
              <span aria-hidden="true">↑</span> Upload photo
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} aria-label="Upload profile photo" />
            </label>
            {image && <button className="profile-remove-photo" type="button" onClick={() => { setImage(null); setError(null) }}>Remove photo</button>}
            <span className="profile-photo-hint">JPG, PNG or WebP · up to 1 MB</span>
          </div>
          <label className="form-field profile-edit-field">
            <span>Display name <b>*</b></span>
            <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
          </label>
          <label className="form-field profile-edit-field">
            <span>Email address</span>
            <input type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} placeholder="you@example.com" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions profile-edit-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit">Save profile <span>↗</span></button>
          </div>
        </form>
      </section>
    </div>
  )
}
