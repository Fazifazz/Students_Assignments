import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleFavorite } from '../features/books/booksSlice';
import ProgressBar from './ProgressBar';

export default function BookCard({ book, showProgress = false, onRemove, removeLabel = 'Remove book' }) {
  const dispatch = useDispatch();
  const progress = book.totalPages ? Math.round((book.pagesRead / book.totalPages) * 100) : 0;
  return (
    <article className="book-card">
      <div className="book-cover-wrap">
        <Link to={`/books/${book.id}`} className="cover-link" aria-label={`View ${book.title}`}>
          <img className="book-cover" src={book.coverUrl || ''} alt={`Cover of ${book.title}`}
            onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=85'; }} />
        </Link>
        {book.status && <span className={`status-pill status-${book.status.toLowerCase().replaceAll(' ', '-')}`}>{book.status}</span>}
        {onRemove ? (
          <button className="favorite-toggle" aria-label={removeLabel} title={removeLabel} onClick={() => onRemove(book.id)}>×</button>
        ) : (
          <button className={`favorite-toggle ${book.favorite ? 'is-favorite' : ''}`} aria-label={book.favorite ? 'Remove from favourites' : 'Add to favourites'} title={book.favorite ? 'Remove from favourites' : 'Add to favourites'} onClick={() => dispatch(toggleFavorite(book.id))}>
            {book.favorite ? '♥' : '♡'}
          </button>
        )}
      </div>
      <div className="book-card-body">
        <span className="book-genre">{book.genre}</span>
        <Link to={`/books/${book.id}`} className="book-title">{book.title}</Link>
        <span className="book-author">{book.author}</span>
        {showProgress && (
          <div className="book-card-progress">
            <div className="progress-caption"><span>{book.pagesRead} of {book.totalPages} pages</span><strong>{progress}%</strong></div>
            <ProgressBar value={progress} />
          </div>
        )}
      </div>
    </article>
  );
}
