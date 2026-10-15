import { Camera, ImagePlus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { PhotoError, prepareProfilePhoto, savePhoto } from '../utils/photo'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Sheet } from './Sheet'

type Props = {
  initials: string
  photo?: string
  onChange: (photo: string | undefined) => void
}

// The patient avatar, and the one way to change it. The avatar itself is the control — a small camera
// badge says so — and the choices open in a sheet, like every other choice in the app.
export function ProfilePhotoPicker({ initials, photo, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const fileRef = useRef<HTMLInputElement>(null)

  const close = () => {
    setOpen(false)
    setError(undefined)
  }

  const apply = async (file: File) => {
    setBusy(true)
    setError(undefined)
    try {
      const prepared = await prepareProfilePhoto(file)
      onChange(prepared)
      // The photo is in use either way; only whether this device kept it is in question.
      if (savePhoto(prepared)) close()
      else setError('Your photo is shown here, but this device had no room to keep it.')
    } catch (e) {
      setError(e instanceof PhotoError ? e.message : 'That photo couldn’t be prepared. Try another one.')
    } finally {
      setBusy(false)
    }
  }

  const remove = () => {
    onChange(undefined)
    savePhoto(undefined)
    close()
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={photo ? 'Change profile photo' : 'Add a profile photo'}
        onClick={() => setOpen(true)}
        className="relative shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Avatar initials={initials} photo={photo} size="lg" />
        <span
          className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-accent text-white ring-[3px] ring-surface"
          aria-hidden
        >
          <Camera className="size-3.5" strokeWidth={2} />
        </span>
      </button>

      {/* Nothing is uploaded: the file is read, cropped and kept in this browser. */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0]
          // Clearing the input lets the same file be picked again after a failure.
          e.target.value = ''
          if (file) void apply(file)
        }}
      />

      {open && (
        <Sheet title="Profile photo" onClose={close}>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Your photo stays on this device. It is never sent to your rehabilitation professional.
          </p>
          {error && (
            <p role="alert" className="mt-4 rounded-card bg-subtle p-4 text-[15px] leading-snug text-ink">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-1">
            <Button
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              icon={<ImagePlus className="size-4" strokeWidth={1.75} aria-hidden />}
            >
              {busy ? 'Preparing photo…' : photo ? 'Choose a new photo' : 'Choose a photo'}
            </Button>
            {photo && (
              <Button
                variant="quiet"
                onClick={remove}
                disabled={busy}
                icon={<Trash2 className="size-4" strokeWidth={1.75} aria-hidden />}
              >
                Remove photo
              </Button>
            )}
            <Button variant="quiet" onClick={close} disabled={busy}>
              Cancel
            </Button>
          </div>
        </Sheet>
      )}
    </>
  )
}
