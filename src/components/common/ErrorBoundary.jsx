//src\components\common\ErrorBoundary.jsx

import { Component } from 'react'
import { ArrowUpRight } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-screen">
          <span className="eyebrow">
            <span className="status-dot" />

            Something needs attention
          </span>

          <h1>
            The portfolio could not render
            this section.
          </h1>

          <p>
            Refresh the page and try again.
            If the problem persists, check
            the browser console for the
            component error.
          </p>

          <button
            className="button primary"
            onClick={() =>
              window.location.reload()
            }
          >
            Reload portfolio
            <ArrowUpRight size={16} />
          </button>
        </main>
      )
    }

    return this.props.children
  }
}