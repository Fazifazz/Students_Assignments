import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";
import { getProgress } from "../utils/bookHelper";

export default function BookCard({
  book,
  onDelete,
  onStatusChange,
  showProgress = false,
  showReview = false,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const progress = getProgress(book);

  return (
    <article className="book-card">
      <div className="book-cover">
        {book.coverUrl && !imageFailed ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="cover-fallback">
            <BookOpen size={30} />
            <span>{book.title}</span>
          </div>
        )}
      </div>

      <div className="book-card-body">
        <div className="book-card-heading">
          <div>
            <h3>{book.title}</h3>
            <p className="muted">{book.author}</p>
          </div>
        </div>

        <div className="book-meta">
          <span>{book.genre}</span>
          <StatusBadge status={book.status} />
        </div>

        {showProgress && (
          <div className="progress-section">
            <div className="progress-label">
              <span>{book.currentPage} / {book.totalPages} pages</span>
              <strong>{progress}%</strong>
            </div>
            <ProgressBar value={progress} />
          </div>
        )}

        {showReview && (
          <div className="review-section">
            <p className="stars">
              {"★".repeat(book.rating || 0)}
              <span>{"☆".repeat(5 - (book.rating || 0))}</span>
            </p>
            {book.review && <p className="muted">{book.review}</p>}
          </div>
        )}

        {onStatusChange && (
          <label className="status-control">
            <span>Reading status</span>
            <select
              value={book.status}
              onChange={(e) => onStatusChange(book.id, e.target.value)}
            >
              <option>Want to Read</option>
              <option>Currently Reading</option>
              <option>Completed</option>
            </select>
          </label>
        )}

        <div className="book-actions">
          <Link
            className="icon-button"
            to={`/edit-book/${book.id}`}
            aria-label={`Edit ${book.title}`}
            title="Edit book"
          >
            <Pencil size={17} />
          </Link>

          {onDelete && (
            <button
              className="icon-button danger"
              onClick={() => onDelete(book.id)}
              aria-label={`Delete ${book.title}`}
              title="Delete book"
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}