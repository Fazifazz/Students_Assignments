import { useDispatch, useSelector } from "react-redux";
import { Star } from "lucide-react";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import { updateBookRating } from "../features/books/booksSlice";

export default function CompletedBooks() {
  const books = useSelector((state) => state.books.books)
    .filter((book) => book.status === "Completed");
  const dispatch = useDispatch();

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">AN ARCHIVE OF ADVENTURES</span>
          <h2>Stories that stay with you.</h2>
          <p className="muted">{books.length} completed books</p>
        </div>
      </div>

      {books.length ? (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="completed-card">
              <BookCard book={book} showReview />
              <div className="rating-editor">
                <label><Star size={16} /> Your rating</label>
                <select
                  aria-label={`Rating for ${book.title}`}
                  value={book.rating || 0}
                  onChange={(e) => dispatch(updateBookRating({
                    id: book.id,
                    rating: Number(e.target.value),
                  }))}
                >
                  <option value="0">Not rated</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option value={n} key={n}>{n} / 5 stars</option>
                  ))}
                </select>

                <label htmlFor={`review-${book.id}`}>Personal review</label>
                <textarea
                  id={`review-${book.id}`}
                  rows="3"
                  defaultValue={book.review}
                  placeholder="Write a few thoughts..."
                  onBlur={(e) => {
                    if (e.target.value !== book.review) {
                      dispatch(updateBookRating({
                        id: book.id,
                        review: e.target.value,
                      }));
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Your finished stories will live here"
          message="Mark a book as completed when you reach the final page." />
      )}
    </div>
  );
}