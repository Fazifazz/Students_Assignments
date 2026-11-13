import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { deleteBook, getBooks, getErrorMessage } from '../api/books';
import BookCard from '../components/BookCard';
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback';

export default function BookList() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const loadBooks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const results = await getBooks(filters);
      setBooks(results);
      if (!filters.search && !filters.genre) {
        setGenres([...new Set(results.map((book) => book.genre))].sort());
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadBooks({ search, genre });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search, genre, loadBooks]);

  async function handleDelete(book) {
    if (!window.confirm(`Delete "${book.title}" from your library?`)) return;
    setDeletingId(book.id);
    setDeleteError('');
    try {
      await deleteBook(book.id);
      await loadBooks({ search, genre });
    } catch (requestError) {
      setDeleteError(getErrorMessage(requestError));
      setDeletingId('');
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE BOOKSHELF</span>
          <h1>All books<span className="heading-period">.</span></h1>
          <p>Every story in your collection, all in one place.</p>
        </div>
        <Link className="button button-primary" to="/books/new"><span aria-hidden="true">＋</span> Add a book</Link>
      </div>

      {location.state?.notice && <div className="alert alert-success" role="status">{location.state.notice}</div>}
      <div className="filter-bar">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="sr-only">Search title or author</span>
          <input
            type="search"
            placeholder="Search title or author…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && <button type="button" className="clear-search" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
        </label>
        <label className="genre-select">
          <span className="sr-only">Filter by genre</span>
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            <option value="">All genres</option>
            {genres.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {deleteError && <ErrorMessage message={deleteError} />}
      {loading && <Loading label="Finding your books…" />}
      {error && <ErrorMessage message={error} onRetry={() => loadBooks({ search, genre })} />}
      {!loading && !error && books.length === 0 && (
        <EmptyState
          title={search || genre ? 'No matching books' : 'Your bookshelf is empty'}
          message={search || genre ? 'Try another search or clear the genre filter.' : 'Add a book to get your collection started.'}
          action={search || genre
            ? <button className="button button-secondary" type="button" onClick={() => { setSearch(''); setGenre(''); }}>Clear filters</button>
            : <Link className="button button-primary" to="/books/new">Add a book</Link>}
        />
      )}
      {!loading && !error && books.length > 0 && (
        <>
          <p className="results-count">{books.length} {books.length === 1 ? 'book' : 'books'} found</p>
          <div className="book-grid">
            {books.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                index={index}
                deleting={deletingId === book.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
