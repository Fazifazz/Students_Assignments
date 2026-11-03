import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found">
      <BookOpen size={42} />
      <span className="eyebrow">PAGE NOT FOUND</span>
      <h1>Looks like this story wandered off.</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="button button-primary" to="/">
        Return to Dashboard
      </Link>
    </div>
  );
}