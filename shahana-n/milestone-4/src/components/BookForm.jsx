import { useState } from 'react';

const emptyBook = { title: '', author: '', genre: '', totalPages: '', pagesRead: 0, coverUrl: '', description: '', status: 'Want to Read' };

export default function BookForm({ initialBook, onSubmit, onCancel }) {
  const [book, setBook] = useState(initialBook ? { ...initialBook } : emptyBook);
  const [error, setError] = useState('');
  const update = (event) => setBook((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const totalPages = Number(book.totalPages);
    let pagesRead = Number(book.pagesRead || 0);
    if (!book.title.trim() || !book.author.trim() || !book.genre.trim() || !totalPages) {
      setError('Please complete the title, author, genre, and total pages.');
      return;
    }
    if (pagesRead < 0 || pagesRead > totalPages) {
      setError('Pages read must be between 0 and the total page count.');
      return;
    }
    if (book.status === 'Completed') pagesRead = totalPages;
    const status = pagesRead === totalPages ? 'Completed' : pagesRead > 0 && book.status === 'Want to Read' ? 'Reading' : book.status;
    setError('');
    onSubmit({ ...book, title: book.title.trim(), author: book.author.trim(), totalPages, pagesRead, status });
  };

  return (
    <form className="book-form" onSubmit={submit}>
      {error && <div className="error-message" role="alert">{error}</div>}
      <div className="form-grid">
        <label className="field field-wide">Book title<input name="title" value={book.title} onChange={update} placeholder="e.g. The Midnight Library" required /></label>
        <label className="field">Author<input name="author" value={book.author} onChange={update} placeholder="Author name" required /></label>
        <label className="field">Genre<input name="genre" value={book.genre} onChange={update} placeholder="Fiction, memoir…" required /></label>
        <label className="field">Total pages<input name="totalPages" type="number" min="1" value={book.totalPages} onChange={update} placeholder="320" required /></label>
        <label className="field">Pages read<input name="pagesRead" type="number" min="0" value={book.pagesRead} onChange={update} /></label>
        <label className="field field-wide">Cover image URL <span className="optional">(optional)</span><input name="coverUrl" type="url" value={book.coverUrl} onChange={update} placeholder="https://…" /></label>
        <label className="field field-wide">Description <span className="optional">(optional)</span><textarea name="description" rows="4" value={book.description} onChange={update} placeholder="What is this book about?" /></label>
        <label className="field">Reading status<select name="status" value={book.status} onChange={update}><option>Want to Read</option><option>Reading</option><option>Completed</option></select></label>
      </div>
      <div className="form-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button className="button button-primary" type="submit">{initialBook ? 'Save changes' : 'Add to my library'} <span>→</span></button></div>
    </form>
  );
}
