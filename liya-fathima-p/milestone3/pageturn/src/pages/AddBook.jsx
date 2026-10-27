import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";
import { addBook } from "../features/books/booksSlice";

export default function AddBook() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const save = (book) => {
    dispatch(addBook(book));
    navigate("/library");
  };

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">GROW YOUR COLLECTION</span>
          <h2>Add a new story.</h2>
          <p className="muted">Fill in the details to add a book to PageTurn.</p>
        </div>
      </div>
      <BookForm onSave={save} />
    </div>
  );
}