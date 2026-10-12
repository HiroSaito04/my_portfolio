//src\components\common\ServiceIcon.jsx

import {
  Code2,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react'

const icons = {
  code: Code2,
  mobile: Smartphone,
  sparkles: Sparkles,
  zap: Zap,
}

export function ServiceIcon({
  name,
  size = 20,
}) {
  const Icon =
    icons[name] ?? Code2

  return (
    <Icon
      size={size}
      aria-hidden="true"
    />
  )
}