import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import BookForm from "../components/BookForm";
import { updateBook } from "../features/books/booksSlice";

export default function EditBook() {
  const { id } = useParams();
  const book = useSelector((state) =>
    state.books.books.find((item) => item.id === id)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!book) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <BookOpen size={40} />
          <h2>Book not found</h2>
          <p>This book may have been deleted or the link is incorrect.</p>
          <Link className="button button-primary" to="/library">
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const save = (updatedBook) => {
    dispatch(updateBook(updatedBook));
    navigate("/library");
  };

  return (
    <div className="page-content">
      <Link to="/library" className="text-link">
        <ArrowLeft size={16} /> Back to library
      </Link>
      <div className="page-intro">
        <div>
          <span className="eyebrow">UPDATE YOUR COLLECTION</span>
          <h2>Edit your book.</h2>
          <p className="muted">Update the details or your reading progress.</p>
        </div>
      </div>
      <BookForm key={book.id} initialBook={book} onSave={save} />
    </div>
  );
}