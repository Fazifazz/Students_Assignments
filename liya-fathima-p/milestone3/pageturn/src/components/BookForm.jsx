import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { GENRES, STATUSES, createId } from "../utils/bookHelper";

const blankBook = {
  title: "",
  author: "",
  genre: "",
  coverUrl: "",
  totalPages: "",
  currentPage: 0,
  status: "Want to Read",
  rating: 0,
  review: "",
};

export default function BookForm({ initialBook, onSave }) {
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({
    ...blankBook,
    ...initialBook,
    totalPages: initialBook?.totalPages ?? "",
    currentPage: initialBook?.currentPage ?? 0,
  }));

  const [errors, setErrors] = useState({});

  const change = (e) => {
    const { name, value } = e.target;

    setForm((previous) => {
      const next = { ...previous, [name]: value };

      if (name === "status") {
        if (value === "Completed") {
          next.currentPage = next.totalPages || "";
        } else if (value === "Want to Read") {
          next.currentPage = 0;
        }
      }

      if (name === "totalPages" && next.status === "Completed") {
        next.currentPage = value;
      }

      return next;
    });

    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const submit = (e) => {
    e.preventDefault();

    const nextErrors = {};
    const total = Number(form.totalPages);
    const current = Number(form.currentPage);

    if (!form.title.trim()) nextErrors.title = "Please enter a book title.";
    if (!form.author.trim()) nextErrors.author = "Please enter the author.";
    if (!form.genre) nextErrors.genre = "Please select a genre.";

    if (form.totalPages === "" || !Number.isInteger(total) || total <= 0) {
      nextErrors.totalPages = "Enter a positive whole number of pages.";
    }

    if (
      form.currentPage === "" ||
      !Number.isInteger(current) ||
      current < 0
    ) {
      nextErrors.currentPage = "Enter zero or a positive whole number.";
    } else if (total > 0 && current > total) {
      nextErrors.currentPage = "Current page cannot exceed total pages.";
    }

    if (
      form.rating !== "" &&
      (!Number.isInteger(Number(form.rating)) ||
        Number(form.rating) < 0 ||
        Number(form.rating) > 5)
    ) {
      nextErrors.rating = "Rating must be between 0 and 5.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const status = form.status;
    const currentPage =
      status === "Completed"
        ? total
        : status === "Want to Read"
          ? 0
          : current;

    onSave({
      ...form,
      id: initialBook?.id || createId(),
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre,
      coverUrl: form.coverUrl.trim(),
      totalPages: total,
      currentPage,
      status,
      rating: Number(form.rating) || 0,
      review: form.review.trim(),
      createdAt: initialBook?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <form className="book-form" onSubmit={submit} noValidate>
      <div className="form-section">
        <h2>Book details</h2>
        <p className="muted">Add the details that make this book yours.</p>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="title">Book title *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={change}
              placeholder="e.g. The Midnight Library"
            />
            {errors.title && <small className="error">{errors.title}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="author">Author *</label>
            <input
              id="author"
              name="author"
              value={form.author}
              onChange={change}
              placeholder="e.g. Matt Haig"
            />
            {errors.author && <small className="error">{errors.author}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="genre">Genre *</label>
            <select id="genre" name="genre" value={form.genre} onChange={change}>
              <option value="">Select a genre</option>
              {GENRES.map((genre) => (
                <option key={genre}>{genre}</option>
              ))}
            </select>
            {errors.genre && <small className="error">{errors.genre}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="coverUrl">Cover image URL (optional)</label>
            <input
              id="coverUrl"
              name="coverUrl"
              type="url"
              value={form.coverUrl}
              onChange={change}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div className="form-field">
            <label htmlFor="totalPages">Total pages *</label>
            <input
              id="totalPages"
              name="totalPages"
              type="number"
              min="1"
              step="1"
              value={form.totalPages}
              onChange={change}
            />
            {errors.totalPages && (
              <small className="error">{errors.totalPages}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="currentPage">Current page</label>
            <input
              id="currentPage"
              name="currentPage"
              type="number"
              min="0"
              step="1"
              value={form.currentPage}
              onChange={change}
              disabled={form.status === "Completed" ||
                form.status === "Want to Read"}
            />
            {errors.currentPage && (
              <small className="error">{errors.currentPage}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="status">Reading status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={change}
            >
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="rating">Rating (optional)</label>
            <select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={change}
            >
              <option value="0">Not rated</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
            {errors.rating && <small className="error">{errors.rating}</small>}
          </div>

          <div className="form-field full-width">
            <label htmlFor="review">Personal review (optional)</label>
            <textarea
              id="review"
              name="review"
              rows="4"
              value={form.review}
              onChange={change}
              placeholder="What did you think about this book?"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => navigate("/library")}
        >
          <X size={17} /> Cancel
        </button>

        <button type="submit" className="button button-primary">
          <Save size={17} /> {initialBook ? "Save Changes" : "Save Book"}
        </button>
      </div>
    </form>
  );
}