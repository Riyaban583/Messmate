import { statusTone } from "../utils/ratingColor";

export default function StatusBadge({ status }) {
  const tone = statusTone(status);
  return <span className={`badge ${tone.bg} ${tone.text}`}>{status}</span>;
}
