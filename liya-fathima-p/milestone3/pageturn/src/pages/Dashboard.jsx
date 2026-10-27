import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, BookMarked, Bookmark, CheckCircle2, Plus } from "lucide-react";
import StatCard from "../components/StatCard";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";
import useLocalStorage from "../hooks/useLocalStorage";


export default function Dashboard() {
  const books = useSelector((state) => state.books.books);
  const [goal, setGoal] = useLocalStorage("pageturn-reading-goal", 12);

  const reading = books.filter((b) => b.status === "Currently Reading");
  const wishlist = books.filter((b) => b.status === "Want to Read");
  const completed = books.filter((b) => b.status === "Completed");

  const recentlyAdded = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">YOUR READING JOURNEY</span>
          <h2>A little reading, a lot of discovery.</h2>
          <p>Keep your stories close and your next adventure in sight.</p>
        </div>
        <Link to="/add-book" className="button button-light">
          <Plus size={18} /> Add a Book
        </Link>
      </section>

      <section className="stats-grid">
        <StatCard icon={BookMarked} label="Total Books" value={books.length}
          note="In your collection" />
        <StatCard icon={BookOpen} label="Currently Reading" value={reading.length}
          note="Stories in progress" />
        <StatCard icon={Bookmark} label="Want to Read" value={wishlist.length}
          note="Next on your list" />
        <StatCard icon={CheckCircle2} label="Completed" value={completed.length}
          note="Stories finished" />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR PROGRESS</span>
            <h2>Reading at a glance</h2>
          </div>
          <Link to="/reading" className="text-link">View reading list →</Link>
        </div>

        <div className="goal-card">
          <div>
            <h3>Annual reading goal</h3>
            <p className="muted">
              {completed.length} of {goal} books completed
            </p>
          </div>
          <label className="goal-input">
            <span>Yearly goal</span>
            <input
              aria-label="Yearly reading goal"
              type="number"
              min="1"
              max="500"
              value={goal}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= 500) setGoal(value);
              }}
            />
          </label>
          <div className="goal-progress">
            <ProgressBar value={Math.min(100, Math.round(completed.length / Math.max(1, goal) * 100))} />
            <span>{Math.min(100, Math.round(completed.length / Math.max(1, goal) * 100))}%</span>
          </div>
        </div>
      </section>

      {reading.length > 0 && (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
              <h2>Currently reading</h2>
            </div>
          </div>
          <div className="book-grid">
            {reading.slice(0, 3).map((book) => (
              <BookCard key={book.id} book={book} showProgress />
            ))}
          </div>
        </section>
      )}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FRESH OFF THE SHELF</span>
            <h2>Recently added</h2>
          </div>
          <Link to="/library" className="text-link">View all books →</Link>
        </div>

        {recentlyAdded.length ? (
          <div className="book-grid">
            {recentlyAdded.map((book) => (
              <BookCard key={book.id} book={book} showProgress />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your library is waiting"
            message="Add your first book and begin your reading journey."
          />
        )}
      </section>
    </div>
  );
}