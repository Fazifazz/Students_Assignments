import { ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  title = "No destinations yet",
  description = "Start exploring and save a few ideas to build your next trip.",
  actionLabel = "Explore destinations",
  actionTo = "/destinations",
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Compass size={28} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={actionTo} className="primary-btn">
        {actionLabel}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
