import { useState } from 'react'
import { readStored, storageKeys, writeStored } from './storage'

// The profile photo is the one picture the person puts into the prototype. It never leaves the device:
// the file is decoded, cropped square, scaled down and kept as a data URL in this browser's storage.

// Big enough to stay sharp at the largest avatar on a 3× screen, small enough that storage can hold it.
const size = 320
const quality = 0.82

// A failure the person should be told about, in words that say what to do next.
export class PhotoError extends Error {}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new PhotoError('That image couldn’t be opened. Try another one.'))
    image.src = src
  })
}

// Takes whatever the person picked and returns the square avatar the app stores: centred on the middle
// of the picture, so a portrait taken in any shape still shows a face rather than a corner.
export async function prepareProfilePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new PhotoError('That file isn’t an image. Choose a photo instead.')

  const url = URL.createObjectURL(file)
  try {
    const image = await loadImage(url)
    const side = Math.min(image.naturalWidth, image.naturalHeight)
    if (!side) throw new PhotoError('That image couldn’t be opened. Try another one.')

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) throw new PhotoError('This browser can’t prepare photos.')

    context.drawImage(
      image,
      (image.naturalWidth - side) / 2,
      (image.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      size,
      size,
    )
    return canvas.toDataURL('image/jpeg', quality)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function readPhoto() {
  return readStored<string | null>(storageKeys.photo, null) ?? undefined
}

// `false` means the photo is in use but storage wouldn't take it, so the screen can say so.
export function savePhoto(photo: string | undefined) {
  return writeStored(storageKeys.photo, photo ?? null)
}

// The photo as the screen currently has it. Read once per screen, like the account itself.
export function useProfilePhoto() {
  return useState(readPhoto)
}
