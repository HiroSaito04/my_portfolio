import { site } from '../config/site'

export function applySiteMetadata() {
  document.title =
    `${site.name} — ${site.role}`

  const description =
    document.querySelector(
      'meta[name="description"]',
    )

  if (description) {
    description.setAttribute(
      'content',
      site.description,
    )
  }
}