
export function getProximityStyle(date: Date) {
  const diff = date.getTime() - Date.now();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days <= 4) return { bg: "bg-red", border: "border-2", };
  if (days <= 7) return { bg: "bg-[#fdf28b]", border: "border-2", };
  if (days <= 14) return { bg: "bg-green", border: "border-2", };
  return { bg: "bg-white", border: "border-2", };
}
