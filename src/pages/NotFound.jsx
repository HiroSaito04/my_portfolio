import { ArrowUpRight } from 'lucide-react'

export function NotFound() {
  return (
    <main className="error-screen">
      <span className="eyebrow">
        <span className="status-dot" />

        404
      </span>

      <h1>
        This page doesn’t exist.
      </h1>

      <p>
        The portfolio page you
        requested could not be found.
      </p>

      <a
        className="button primary"
        href="/"
      >
        Return home
        <ArrowUpRight size={16} />
      </a>
    </main>
  )
}