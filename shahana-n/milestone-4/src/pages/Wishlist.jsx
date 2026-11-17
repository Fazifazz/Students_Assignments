import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addWishlistBook, moveWishlistBook, removeWishlistBook } from '../features/wishlist/wishlistSlice';
import { EmptyState, Modal, PageIntro, SearchBar } from '../components/UI';

function WishlistForm({ onCancel, onSave }) {
  const [book, setBook] = useState({ title: '', author: '', genre: '', coverUrl: '' });
  const update = (event) => setBook((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (book.title.trim() && book.author.trim() && book.genre.trim()) onSave({ ...book, title: book.title.trim(), author: book.author.trim() });
  };
  return <form className="bookmark-form" onSubmit={submit}><label className="field">Book title<input name="title" value={book.title} onChange={update} required placeholder="A book to look forward to" /></label><label className="field">Author<input name="author" value={book.author} onChange={update} required /></label><label className="field">Genre<input name="genre" value={book.genre} onChange={update} required /></label><label className="field">Cover image URL <span className="optional">(optional)</span><input name="coverUrl" type="url" value={book.coverUrl} onChange={update} /></label><div className="form-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button type="submit" className="button button-primary">Add to wishlist <span>→</span></button></div></form>;
}

function MoveToLibraryForm({ book, onCancel, onSave }) {
  const [totalPages, setTotalPages] = useState('');
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    const pageCount = Number(totalPages);
    if (!Number.isInteger(pageCount) || pageCount < 1) {
      setError('Enter the total number of pages in this book.');
      return;
    }
    onSave(pageCount);
  };
  return <form className="bookmark-form" onSubmit={submit}><p className="modal-message">Add <strong>{book.title}</strong> to your library. How many pages does it have?</p>{error && <div className="error-message" role="alert">{error}</div>}<label className="field">Total pages<input autoFocus type="number" min="1" value={totalPages} onChange={(event) => setTotalPages(event.target.value)} placeholder="e.g. 320" required /></label><div className="form-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button type="submit" className="button button-primary">Add to my library <span>→</span></button></div></form>;
}

export default function Wishlist() {
  const books = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [movingBook, setMovingBook] = useState(null);
  const filtered = useMemo(() => books.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())), [books, query]);
  const moveToLibrary = async (book, totalPages) => {
    const result = await dispatch(moveWishlistBook({ id: book.id, totalPages }));
    if (moveWishlistBook.fulfilled.match(result)) setMovingBook(null);
  };

  return (
    <div className="page-content">
      <PageIntro eyebrow="SOMEDAY, SOON" title="Books to look forward to" description="A little list of stories waiting for the right moment.">
        <button className="button button-primary" onClick={() => setAdding(true)}><span>＋</span> Add to wishlist</button>
      </PageIntro>
      <div className="library-toolbar wishlist-toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Search your wishlist…" /><span className="wishlist-count">{books.length} on your list</span></div>
      {filtered.length ? <div className="wishlist-grid">{filtered.map((book) => <article className="wishlist-card" key={book.id}><img src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=85'} alt={`Cover of ${book.title}`} /><div className="wishlist-copy"><span className="book-genre">{book.genre}</span><strong>{book.title}</strong><span className="book-author">{book.author}</span><button className="text-button" onClick={() => setMovingBook(book)}>Move to my library →</button></div><button className="favorite-toggle" onClick={() => dispatch(removeWishlistBook(book.id))} aria-label={`Remove ${book.title} from wishlist`}>×</button></article>)}</div> : <EmptyState icon="♡" title={query ? 'No matches just yet' : 'Your next favorite might be here'} description={query ? 'Try another title or author.' : 'Add the books you can’t wait to read.'}><button className="button button-primary" onClick={() => setAdding(true)}>Add to wishlist</button></EmptyState>}
      {adding && <Modal title="Add to your wishlist" onClose={() => setAdding(false)}><WishlistForm onCancel={() => setAdding(false)} onSave={async (book) => { const result = await dispatch(addWishlistBook(book)); if (addWishlistBook.fulfilled.match(result)) setAdding(false); }} /></Modal>}
      {movingBook && <Modal title="Move to my library" onClose={() => setMovingBook(null)}><MoveToLibraryForm book={movingBook} onCancel={() => setMovingBook(null)} onSave={(pageCount) => moveToLibrary(movingBook, pageCount)} /></Modal>}
    </div>
  );
}
