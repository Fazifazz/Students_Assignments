import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BookForm from '../components/BookForm';
import { PageIntro } from '../components/UI';
import { addBook, updateBook } from '../features/books/booksSlice';

export default function BookEditor() {
  const { bookId } = useParams();
  const book = useSelector((state) => state.books.items.find((item) => item.id === bookId));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editing = Boolean(bookId);

  if (editing && !book) return <div className="page-content"><PageIntro eyebrow="YOUR LIBRARY" title="Book not found" description="This book may have been removed from your library." /><Link className="button button-primary" to="/library">Back to library</Link></div>;

  const save = async (values) => {
    if (editing) {
      const result = await dispatch(updateBook({ ...book, ...values }));
      if (updateBook.fulfilled.match(result)) navigate(`/books/${book.id}`);
    } else {
      const result = await dispatch(addBook(values));
      if (addBook.fulfilled.match(result)) navigate('/library');
    }
  };

  return (
    <div className="page-content narrow-page">
      <PageIntro eyebrow={editing ? 'UPDATE YOUR SHELF' : 'GROW YOUR COLLECTION'} title={editing ? 'Edit your book' : 'Add a new book'} description={editing ? 'Update the details on your bookshelf.' : 'Every great reading journey starts with a single page.'} />
      <section className="form-panel"><BookForm initialBook={book} onSubmit={save} onCancel={() => navigate(editing ? `/books/${book.id}` : '/library')} /></section>
    </div>
  );
}
