import { Link } from 'react-router-dom';

const coverColors = ['cover-forest', 'cover-rose', 'cover-gold', 'cover-blue', 'cover-plum'];

export default function BookCard({ book, index = 0, onDelete, deleting = false }) {
  return (
    <article className="book-card">
      <div className={`book-cover ${coverColors[index % coverColors.length]}`}>
        <span className="cover-emblem" aria-hidden="true">✦</span>
        <span className="cover-title">{book.title}</span>
        <span className="cover-author">{book.author}</span>
      </div>
      <div className="book-card-body">
        <div className="book-card-meta">
          <span className="genre-tag">{book.genre}</span>
          <span className={`availability ${book.available ? 'available' : 'checked-out'}`}>
            <span />{book.available ? 'Available' : 'Checked out'}
          </span>
        </div>
        <h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
        <p className="book-author">{book.author} <span>·</span> {book.publishedYear}</p>
        <div className="book-card-actions">
          <Link className="text-link" to={`/books/${book.id}`}>View details <span aria-hidden="true">→</span></Link>
          {onDelete && (
            <button
              className="icon-button delete-button"
              type="button"
              aria-label={`Delete ${book.title}`}
              disabled={deleting}
              onClick={() => onDelete(book)}
            >
              {deleting ? '…' : '×'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
