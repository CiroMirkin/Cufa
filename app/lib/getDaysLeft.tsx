
export function getDaysLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return "Hoy"
  if (days === 1) return "Mañana"
  return `${days} días`
}
