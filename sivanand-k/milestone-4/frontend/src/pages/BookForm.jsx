import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createBook, getBook, getErrorMessage, updateBook } from '../api/books';
import { ErrorMessage, Loading } from '../components/Feedback';

const emptyBook = {
  title: '',
  author: '',
  genre: '',
  publishedYear: '',
  available: 'true'
};

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(emptyBook);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let active = true;
    getBook(id)
      .then((book) => {
        if (active) {
          setForm({
            title: book.title,
            author: book.author,
            genre: book.genre,
            publishedYear: String(book.publishedYear),
            available: String(book.available)
          });
        }
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const book = {
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      publishedYear: Number(form.publishedYear),
      available: form.available === 'true'
    };

    try {
      const savedBook = isEditing ? await updateBook(id, book) : await createBook(book);
      navigate(`/books/${savedBook.id}`, {
        replace: true,
        state: { notice: isEditing ? 'Book details updated.' : 'Book added to your library.' }
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setSaving(false);
    }
  }

  if (loading) return <Loading label="Loading book details…" />;

  return (
    <>
      <div className="page-heading form-page-heading">
        <div>
          <Link className="back-link" to={isEditing ? `/books/${id}` : '/books'}>← Back to {isEditing ? 'book' : 'books'}</Link>
          <span className="eyebrow">{isEditing ? 'UPDATE YOUR SHELF' : 'GROW YOUR COLLECTION'}</span>
          <h1>{isEditing ? 'Edit book' : 'Add a book'}<span className="heading-period">.</span></h1>
          <p>{isEditing ? 'Make changes to this book’s details.' : 'Add a new story to your personal library.'}</p>
        </div>
      </div>

      <form className="book-form" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}
        <div className="form-section-title">
          <span className="form-section-number">01</span>
          <div><h2>Book information</h2><p>Tell us a little about this title.</p></div>
        </div>
        <div className="form-grid">
          <label className="form-field form-field-wide">
            <span>Book title <b>*</b></span>
            <input name="title" value={form.title} onChange={updateField} required maxLength={120} placeholder="e.g. The Midnight Library" />
          </label>
          <label className="form-field">
            <span>Author <b>*</b></span>
            <input name="author" value={form.author} onChange={updateField} required maxLength={100} placeholder="e.g. Matt Haig" />
          </label>
          <label className="form-field">
            <span>Genre <b>*</b></span>
            <input name="genre" value={form.genre} onChange={updateField} required maxLength={60} placeholder="e.g. Fiction" />
          </label>
          <label className="form-field">
            <span>Published year <b>*</b></span>
            <input name="publishedYear" type="number" step="1" value={form.publishedYear} onChange={updateField} required placeholder="e.g. 2020" />
          </label>
          <label className="form-field">
            <span>Availability <b>*</b></span>
            <select name="available" value={form.available} onChange={updateField}>
              <option value="true">Available</option>
              <option value="false">Checked out</option>
            </select>
          </label>
        </div>
        <div className="form-footer">
          <p><span>*</span> All fields are required.</p>
          <div className="form-actions">
            <Link className="button button-secondary" to={isEditing ? `/books/${id}` : '/books'}>Cancel</Link>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add to library'}
              {!saving && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
