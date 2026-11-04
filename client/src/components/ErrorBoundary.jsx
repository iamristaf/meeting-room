import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { failed: false, message: '' }

  static getDerivedStateFromError(error) {
    return { failed: true, message: String(error?.message ?? error) }
  }

  componentDidCatch(error, info) {
    console.error(error, info?.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-xl font-semibold text-ink">Something went wrong</h1>
        <p className="text-sm text-muted">Reload the page to continue.</p>
        {import.meta.env.DEV && this.state.message && (
          <p className="max-w-xl break-words text-xs text-rose-ink">{this.state.message}</p>
        )}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong"
        >
          Reload
        </button>
      </div>
    )
  }
}
