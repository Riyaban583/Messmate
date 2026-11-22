export function formatDate(dateInput, opts = {}) {
  const date = new Date(dateInput)
  return date.toLocaleDateString('en-IN', {
    weekday: opts.short ? undefined : 'short',
    day: 'numeric',
    month: 'short',
    year: opts.year ? 'numeric' : undefined,
  })
}

export function formatRelativeTime(dateInput) {
  const date = new Date(dateInput)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.round(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.round(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
