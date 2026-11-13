import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteBook, getBook, getErrorMessage } from '../api/books';
import { ErrorMessage, Loading } from '../components/Feedback';

export default function BookDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadBook = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBook(await getBook(id));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  async function handleDelete() {
    if (!window.confirm(`Delete "${book.title}" from your library?`)) return;
    setDeleting(true);
    setError('');
    try {
      await deleteBook(book.id);
      navigate('/books', { replace: true, state: { notice: 'Book removed from your library.' } });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setDeleting(false);
    }
  }

  if (loading) return <Loading label="Opening book details…" />;
  if (error && !book) return <ErrorMessage message={error} onRetry={loadBook} />;
  if (!book) return null;

  return (
    <>
      <Link className="back-link" to="/books">← Back to all books</Link>
      {location.state?.notice && <div className="alert alert-success" role="status">{location.state.notice}</div>}
      {error && <ErrorMessage message={error} />}
      <section className="detail-panel">
        <div className="detail-cover-wrap">
          <div className="detail-cover">
            <span className="cover-emblem" aria-hidden="true">✦</span>
            <span className="detail-cover-title">{book.title}</span>
            <span className="cover-author">{book.author}</span>
          </div>
          <span className={`availability detail-availability ${book.available ? 'available' : 'checked-out'}`}>
            <span />{book.available ? 'Available to read' : 'Currently checked out'}
          </span>
        </div>
        <div className="detail-content">
          <span className="eyebrow">BOOK DETAILS</span>
          <span className="genre-tag detail-genre">{book.genre}</span>
          <h1>{book.title}<span className="heading-period">.</span></h1>
          <p className="detail-author">by <strong>{book.author}</strong></p>
          <div className="detail-rule" />
          <dl className="detail-facts">
            <div><dt>Published</dt><dd>{book.publishedYear}</dd></div>
            <div><dt>Genre</dt><dd>{book.genre}</dd></div>
            <div><dt>Availability</dt><dd>{book.available ? 'Available' : 'Checked out'}</dd></div>
            <div><dt>Library ID</dt><dd className="book-id">{book.id}</dd></div>
          </dl>
          <div className="detail-actions">
            <Link className="button button-primary" to={`/books/${book.id}/edit`}>Edit book <span aria-hidden="true">↗</span></Link>
            <button className="button button-danger" type="button" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Removing…' : 'Remove book'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
