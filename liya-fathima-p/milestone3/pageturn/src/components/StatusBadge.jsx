export default function StatusBadge({ status }) {
  const className = {
    "Want to Read": "status-wishlist",
    "Currently Reading": "status-reading",
    Completed: "status-completed",
  }[status] || "";

  return <span className={`status-badge ${className}`}>{status}</span>;
}