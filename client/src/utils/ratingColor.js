// Semantic rating color, matching design.md: >=4 success, 2.5-4 warning, <2.5 danger
export function ratingTone(rating) {
  if (rating >= 4) return { text: "text-success", bg: "bg-success-bg" };
  if (rating >= 2.5) return { text: "text-warning", bg: "bg-warning-bg" };
  return { text: "text-danger", bg: "bg-danger-bg" };
}

export function statusTone(status) {
  const map = {
    Pending: { text: "text-warning", bg: "bg-warning-bg" },
    "Under Review": { text: "text-info", bg: "bg-info-bg" },
    "In Progress": { text: "text-info", bg: "bg-info-bg" },
    Resolved: { text: "text-success", bg: "bg-success-bg" },
    Rejected: { text: "text-danger", bg: "bg-danger-bg" },
    Approved: { text: "text-success", bg: "bg-success-bg" },
  };
  return map[status] || { text: "text-ink-secondary", bg: "bg-surface-page" };
}
