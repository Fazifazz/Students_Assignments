import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, deleteBookmark } from '../features/bookmarks/bookmarksSlice';
import { deleteBook, fetchBook, toggleFavorite, updateProgress } from '../features/books/booksSlice';
import BookmarkEditor from '../components/BookmarkEditor';
import ProgressBar from '../components/ProgressBar';
import { ConfirmModal, LoadingSpinner, Modal, PageIntro } from '../components/UI';

export default function BookDetails() {
  const { bookId } = useParams();
  const book = useSelector((state) => state.books.items.find((item) => item.id === bookId));
  const books = useSelector((state) => state.books.items);
  const allBookmarks = useSelector((state) => state.bookmarks.items);
  const bookmarks = allBookmarks.filter((item) => item.bookId === bookId).sort((a, b) => b.page - a.page);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const booksLoading = useSelector((state) => state.books.loading);
  const [pageInput, setPageInput] = useState('');
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!book) dispatch(fetchBook(bookId));
  }, [book, bookId, dispatch]);

  if (!book && booksLoading) return <LoadingSpinner />;
  if (!book) return <div className="page-content"><PageIntro eyebrow="YOUR LIBRARY" title="Book not found" description="This book may have been removed from your library." /><Link className="button button-primary" to="/library">Back to library</Link></div>;
  const progress = Math.round((book.pagesRead / book.totalPages) * 100);
  const remaining = Math.max(0, book.totalPages - book.pagesRead);

  const saveProgress = async (event) => {
    event.preventDefault();
    const nextPage = Number(pageInput);
    if (!Number.isInteger(nextPage) || nextPage < 0 || nextPage > book.totalPages) return;
    const result = await dispatch(updateProgress({ id: book.id, pagesRead: nextPage }));
    if (updateProgress.fulfilled.match(result)) setPageInput('');
  };

  return (
    <div className="page-content">
      <div className="detail-back"><Link to="/library">← Back to my library</Link><div><Link className="button button-quiet" to={`/books/${book.id}/edit`}>✎ Edit book</Link><button className="button button-quiet" onClick={() => setDeleting(true)}>Delete</button></div></div>
      <section className="detail-panel">
        <div className="detail-cover-wrap"><img className="detail-cover" src={book.coverUrl} alt={`Cover of ${book.title}`} /><span className={`status-pill status-${book.status.toLowerCase().replaceAll(' ', '-')}`}>{book.status}</span></div>
        <div className="detail-main">
          <div className="detail-heading"><div><span className="book-genre">{book.genre}</span><h2>{book.title}</h2><p className="detail-author">by {book.author}</p></div><button className={`favorite-detail ${book.favorite ? 'is-favorite' : ''}`} onClick={() => dispatch(toggleFavorite(book.id))} aria-label={book.favorite ? 'Remove from favourites' : 'Add to favourites'}>{book.favorite ? '♥' : '♡'}</button></div>
          <p className="detail-description">{book.description || 'No description added yet. Edit this book to add a few details.'}</p>
          <div className="detail-stats"><div><span>TOTAL PAGES</span><strong>{book.totalPages}</strong></div><div><span>PAGES READ</span><strong>{book.pagesRead}</strong></div><div><span>REMAINING</span><strong>{remaining}</strong></div></div>
          <div className="detail-progress"><div className="progress-caption"><span>Your reading progress</span><strong>{progress}%</strong></div><ProgressBar value={progress} /><p>{book.pagesRead} of {book.totalPages} pages read</p></div>
          <form className="progress-update-form" onSubmit={saveProgress}><label className="field">Update current page<input type="number" min="0" max={book.totalPages} value={pageInput} onChange={(event) => setPageInput(event.target.value)} placeholder={`Current: ${book.pagesRead}`} /></label><button className="button button-primary" type="submit" disabled={!pageInput}>Update progress <span>→</span></button></form>
          <button className="button button-outline bookmark-cta" onClick={() => setBookmarkOpen(true)}>⚑ Add a bookmark</button>
        </div>
      </section>
      <section className="detail-bookmarks"><div className="section-heading"><h3>Your bookmarks <span className="count-badge">{bookmarks.length}</span></h3><button className="text-button" onClick={() => setBookmarkOpen(true)}>＋ Add bookmark</button></div>
        {bookmarks.length ? <div className="detail-bookmark-list">{bookmarks.map((mark) => <div className="detail-bookmark" key={mark.id}><span className="bookmark-page">p. {mark.page}</span><p>{mark.note || 'No note added.'}</p><button className="text-button" onClick={() => dispatch(deleteBookmark(mark.id))} aria-label={`Delete bookmark on page ${mark.page}`}>Remove</button></div>)}</div> : <p className="muted-copy">Save a page to find your way back to a favorite passage.</p>}
      </section>
      {bookmarkOpen && <Modal title="Save a bookmark" onClose={() => setBookmarkOpen(false)}><BookmarkEditor books={books} defaultBookId={book.id} onCancel={() => setBookmarkOpen(false)} onSave={(mark) => { dispatch(addBookmark(mark)); setBookmarkOpen(false); }} /></Modal>}
      {deleting && <ConfirmModal title="Remove this book?" message={`“${book.title}” and its reading data will be removed from your library.`} onCancel={() => setDeleting(false)} onConfirm={async () => { const result = await dispatch(deleteBook(book.id)); if (deleteBook.fulfilled.match(result)) navigate('/library'); }} />}
    </div>
  );
}
