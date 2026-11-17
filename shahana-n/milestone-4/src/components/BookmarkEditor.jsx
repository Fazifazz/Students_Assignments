import { useState } from 'react';

export default function BookmarkEditor({ initialBookmark, books, defaultBookId, onSave, onCancel }) {
  const [bookId, setBookId] = useState(initialBookmark?.bookId || defaultBookId || books[0]?.id || '');
  const book = books.find((item) => item.id === bookId);
  const [page, setPage] = useState(initialBookmark?.page ?? '');
  const [note, setNote] = useState(initialBookmark?.note || '');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const pageNumber = Number(page);
    if (!book) return setError('Choose a book for this bookmark.');
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > book.totalPages) {
      return setError(`Enter a page between 1 and ${book.totalPages}.`);
    }
    setError('');
    onSave({ ...(initialBookmark || {}), bookId, page: pageNumber, note: note.trim() });
  };

  return (
    <form className="bookmark-form" onSubmit={submit}>
      {error && <div className="error-message" role="alert">{error}</div>}
      {!defaultBookId && <label className="field">Book<select value={bookId} onChange={(event) => setBookId(event.target.value)}>{books.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label>}
      <label className="field">Page number<input type="number" min="1" max={book?.totalPages || undefined} value={page} onChange={(event) => setPage(event.target.value)} placeholder="45" required /></label>
      <label className="field">Note <span className="optional">(optional)</span><textarea rows="4" value={note} onChange={(event) => setNote(event.target.value)} placeholder="What would you like to remember?" /></label>
      <div className="form-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button type="submit" className="button button-primary">{initialBookmark ? 'Save bookmark' : 'Save bookmark'} <span>→</span></button></div>
    </form>
  );
}
