import { useDispatch, useSelector } from "react-redux";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import { deleteBook, updateBookStatus } from "../features/books/booksSlice";

export default function Wishlist() {
  const books = useSelector((state) => state.books.books)
    .filter((book) => book.status === "Want to Read");
  const dispatch = useDispatch();

  const remove = (id) => {
    if (window.confirm("Delete this book from your library?")) {
      dispatch(deleteBook(id));
    }
  };

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">NEXT ON YOUR LIST</span>
          <h2>Stories waiting to be discovered.</h2>
        </div>
      </div>

      {books.length ? (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="wishlist-card">
              <BookCard
                book={book}
                onDelete={remove}
                onStatusChange={(id, status) =>
                  dispatch(updateBookStatus({ id, status }))
                }
              />
              <button
                className="button button-primary full-button"
                onClick={() => dispatch(updateBookStatus({
                  id: book.id,
                  status: "Currently Reading",
                }))}
              >
                Start Reading
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Your next adventure awaits"
          message="Save books to your wishlist for the next time you need a story." />
      )}
    </div>
  );
}