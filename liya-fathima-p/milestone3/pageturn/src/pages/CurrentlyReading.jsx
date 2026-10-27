import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateReadingProgress } from "../features/books/booksSlice";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";

export default function CurrentlyReading() {
  const books = useSelector((state) => state.books.books)
    .filter((book) => book.status === "Currently Reading");
  const dispatch = useDispatch();
  const [pages, setPages] = useState({});

  const updatePage = (book, value) => {
    setPages((previous) => ({ ...previous, [book.id]: value }));
  };

  const savePage = (book) => {
    const raw = pages[book.id] ?? String(book.currentPage);
    const page = Number(raw);

    if (raw === "" || !Number.isInteger(page) ||
        page < 0 || page > book.totalPages) {
      window.alert(`Enter a whole number from 0 to ${book.totalPages}.`);
      return;
    }

    dispatch(updateReadingProgress({ id: book.id, currentPage: page }));
  };

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">IN PROGRESS</span>
          <h2>One page at a time.</h2>
          <p className="muted">Your current reading adventures.</p>
        </div>
      </div>

      {books.length ? (
        <div className="book-grid">
          {books.map((book) => (
            <div className="reading-card" key={book.id}>
              <BookCard book={book} showProgress />
              <div className="page-updater">
                <label htmlFor={`page-${book.id}`}>Update current page</label>
                <div className="page-update-row">
                  <input
                    id={`page-${book.id}`}
                    type="number"
                    min="0"
                    max={book.totalPages}
                    step="1"
                    value={pages[book.id] ?? String(book.currentPage)}
                    onChange={(e) => updatePage(book, e.target.value)}
                  />
                  <button className="button button-primary"
                    onClick={() => savePage(book)}>
                    Save
                  </button>
                </div>
                <small className="muted">Total: {book.totalPages} pages</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing on your nightstand"
          message="Move a book to Currently Reading to track your progress."
        />
      )}
    </div>
  );
}