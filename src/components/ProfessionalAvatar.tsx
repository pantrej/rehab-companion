import type { ComponentProps } from 'react'
import type { Professional } from '../types/care'
import { Avatar } from './Avatar'

type Props = {
  professional: Professional
  size?: ComponentProps<typeof Avatar>['size']
}

export function ProfessionalAvatar({ professional, size = 'md' }: Props) {
  return <Avatar initials={professional.initials} photo={professional.photo} size={size} tone="professional" />
}
