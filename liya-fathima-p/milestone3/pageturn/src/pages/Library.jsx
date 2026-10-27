import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Library as LibraryIcon } from "lucide-react";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import { deleteBook, updateBookStatus } from "../features/books/booksSlice";
import { GENRES, STATUSES } from "../utils/bookHelper";

export default function Library() {
  const books = useSelector((state) => state.books.books);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [genre, setGenre] = useState("All");

  const filtered = books.filter((book) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term);

    return (
      matchesSearch &&
      (status === "All" || book.status === status) &&
      (genre === "All" || book.genre === genre)
    );
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">YOUR COLLECTION</span>
          <h2>Every story, in one place.</h2>
          <p className="muted">{books.length} books in your personal library</p>
        </div>
        <Link to="/add-book" className="button button-primary">
          <Plus size={18} /> Add a Book
        </Link>
      </div>

      <div className="filter-panel">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search books"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select aria-label="Filter by status" value={status}
          onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select aria-label="Filter by genre" value={genre}
          onChange={(e) => setGenre(e.target.value)}>
          <option value="All">All genres</option>
          {GENRES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div className="results-label">
        <LibraryIcon size={17} />
        <span>{filtered.length} {filtered.length === 1 ? "book" : "books"} found</span>
      </div>

      {filtered.length ? (
        <div className="book-grid">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              showProgress
              onDelete={handleDelete}
              onStatusChange={(id, newStatus) =>
                dispatch(updateBookStatus({ id, status: newStatus }))
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={books.length ? "No matching books" : "Your library is empty"}
          message={books.length
            ? "Try changing your search or filters."
            : "Add a book to start building your collection."}
        />
      )}
    </div>
  );
}