export function getProximityStyle(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days <= 4) return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" };
  if (days <= 7) return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" };
  if (days <= 14) return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" };
  return { bg: "bg-white", border: "border-neutral-200", text: "text-neutral-500" };
}
