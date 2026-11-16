import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BookCard from '../components/BookCard';
import { ConfirmModal, EmptyState, PageIntro, SearchBar } from '../components/UI';
import { deleteBook } from '../features/books/booksSlice';

export default function Library() {
  const books = useSelector((state) => state.books.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All genres');
  const [status, setStatus] = useState('All statuses');
  const [sort, setSort] = useState('Recently added');
  const [deleting, setDeleting] = useState(null);
  const genres = [...new Set(books.map((book) => book.genre))].sort();
  const filtered = useMemo(() => {
    const result = books.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())
      && (genre === 'All genres' || book.genre === genre)
      && (status === 'All statuses' || book.status === status));
    if (sort === 'Title A–Z') result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'Progress') result.sort((a, b) => (b.pagesRead / b.totalPages) - (a.pagesRead / a.totalPages));
    else result.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    return result;
  }, [books, query, genre, status, sort]);

  const confirmDelete = async () => {
    const result = await dispatch(deleteBook(deleting.id));
    if (deleteBook.fulfilled.match(result)) setDeleting(null);
  };

  return (
    <div className="page-content">
      <PageIntro eyebrow="YOUR PERSONAL COLLECTION" title="A library of your own" description={`${books.length} books, and every one has a story.`}>
        <Link className="button button-primary" to="/books/new"><span>＋</span> Add a book</Link>
      </PageIntro>
      <div className="library-toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <div className="filter-controls">
          <label><span className="sr-only">Filter by genre</span><select value={genre} onChange={(event) => setGenre(event.target.value)}><option>All genres</option>{genres.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Reading</option><option>Completed</option><option>Want to Read</option></select></label>
          <label><span className="sr-only">Sort books</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recently added</option><option>Title A–Z</option><option>Progress</option></select></label>
        </div>
      </div>
      <div className="results-caption"><span>{filtered.length} {filtered.length === 1 ? 'book' : 'books'}</span><span>Showing your collection</span></div>
      {filtered.length ? <div className="book-grid">{filtered.map((book) => <div className="library-book" key={book.id}><BookCard book={book} showProgress={book.status === 'Reading'} /><div className="card-actions"><Link to={`/books/${book.id}`}>View details</Link><button onClick={() => navigate(`/books/${book.id}/edit`)}>Edit</button><button onClick={() => setDeleting(book)}>Delete</button></div></div>)}</div>
        : <EmptyState icon="⌕" title="No books found" description={query ? 'Try another search or adjust your filters.' : 'Add your first book and make this shelf yours.'}><Link className="button button-primary" to="/books/new">Add a book</Link></EmptyState>}
      {deleting && <ConfirmModal title="Remove this book?" message={`“${deleting.title}” will be removed from your library. This can't be undone.`} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />}
    </div>
  );
}
