import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  title = "Nothing here yet",
  message = "Add a book to get started.",
}) {
  return (
    <div className="empty-state">
      <BookOpen size={38} strokeWidth={1.4} />
      <h3>{title}</h3>
      <p>{message}</p>
      <Link className="button button-primary" to="/add-book">
        Add a Book
      </Link>
    </div>
  );
}