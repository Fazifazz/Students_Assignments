import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getErrorMessage } from '../api/books';
import BookCard from '../components/BookCard';
import { ErrorMessage, Loading } from '../components/Feedback';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBooks(await getBooks());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const availableCount = books.filter((book) => book.available).length;
  const genresCount = new Set(books.map((book) => book.genre)).size;

  return (
    <>
      <section className="welcome-panel">
        <div className="welcome-copy">
          <span className="eyebrow">YOUR PERSONAL LIBRARY</span>
          <h1>A good book is<br />always a <em>good idea.</em></h1>
          <p>Keep your collection close. Find your next favorite read.</p>
          <Link className="button button-light" to="/books">
            Explore your books <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-sun" />
          <div className="art-book art-book-back" />
          <div className="art-book art-book-front"><span>READ<br />MORE</span></div>
          <span className="art-sparkle sparkle-one">✦</span>
          <span className="art-sparkle sparkle-two">✧</span>
        </div>
      </section>

      <section className="stats-grid" aria-label="Library statistics">
        <StatCard label="Total books" value={loading ? '—' : books.length} icon="▤" tone="green" />
        <StatCard label="Available to read" value={loading ? '—' : availableCount} icon="✓" tone="peach" />
        <StatCard label="Genres in collection" value={loading ? '—' : genresCount} icon="✳" tone="lavender" />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FRESH FROM THE SHELVES</span>
            <h2>Your collection</h2>
          </div>
          <Link className="text-link" to="/books">View all books <span aria-hidden="true">→</span></Link>
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} onRetry={loadBooks} />}
        {!loading && !error && books.length === 0 && (
          <div className="empty-state compact-empty">
            <h2>Your shelves are waiting</h2>
            <p>Add your first book to start your collection.</p>
            <Link className="button button-primary" to="/books/new">Add your first book</Link>
          </div>
        )}
        {!loading && !error && books.length > 0 && (
          <div className="book-grid">
            {books.slice(0, 3).map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function StatCard({ label, value, icon, tone }) {
  return (
    <article className="stat-card">
      <span className={`stat-icon ${tone}`} aria-hidden="true">{icon}</span>
      <div>
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
      </div>
    </article>
  );
}
