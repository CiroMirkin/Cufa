
function sanitizeFilename(title: string) {
  return title.trim().replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'document'
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportAsMarkdown(title: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, `${sanitizeFilename(title)}.md`)
}
