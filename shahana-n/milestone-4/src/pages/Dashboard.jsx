import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BookCard from '../components/BookCard';
import ProgressBar from '../components/ProgressBar';
import { PageIntro, SectionHeading, StatCard, EmptyState } from '../components/UI';
import { useReadingStats } from '../hooks/useReadingStats';
import { dateKeyDaysAgo } from '../utils/date';

const formatDate = (date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' });

export default function Dashboard() {
  const books = useSelector((state) => state.books.items);
  const activities = useSelector((state) => state.readingActivity.items);
  const { dailyTarget, dailyProgress, streak } = useSelector((state) => state.goals);
  const stats = useReadingStats();
  const reading = books.filter((book) => book.status === 'Reading');
  const todayPages = dailyProgress[dateKeyDaysAgo(0)] || 0;
  const progress = Math.min(100, Math.round((todayPages / dailyTarget) * 100));
  const recent = [...activities].slice(0, 4);
  const mondayOffset = (new Date().getDay() + 6) % 7;
  const weeklyDays = Array.from({ length: 7 }, (_, index) => {
    const daysAway = index - mondayOffset;
    const date = new Date();
    date.setDate(date.getDate() + daysAway);
    return { label: date.toLocaleDateString('en', { weekday: 'short' }), pages: dailyProgress[dateKeyDaysAgo(-daysAway)] || 0 };
  });
  const weeklyTotal = weeklyDays.reduce((total, day) => total + day.pages, 0);
  const weeklyMax = Math.max(30, ...weeklyDays.map((day) => day.pages));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-content dashboard-page">
      <PageIntro eyebrow="YOUR READING LIFE, IN FOCUS" title={`${greeting} ☀️`} description="A little reading goes a long way. Here's your week at a glance." />
      <section className="stats-grid">
        <StatCard icon="▤" label="Books in library" value={stats.totalBooks} note="+2 this month" tone="lavender" />
        <StatCard icon="◷" label="Currently reading" value={stats.currentlyReading} note="Keep the pages turning" tone="sage" />
        <StatCard icon="✳" label="Books completed" value={stats.completedBooks} note="A story well lived" tone="peach" />
        <StatCard icon="♡" label="On your wishlist" value={stats.wishlistCount} note="For another good day" tone="blue" />
      </section>

      <section className="dashboard-feature-grid">
        <div className="goal-banner">
          <div className="goal-banner-top"><span className="goal-icon">✷</span><span className="goal-tag">TODAY’S READING GOAL</span><Link to="/goals">View goals <span>→</span></Link></div>
          <div className="goal-banner-main"><div><h3>{todayPages} <span>/ {dailyTarget} pages</span></h3><p>{todayPages >= dailyTarget ? 'Beautiful work. You reached your daily goal!' : `${Math.max(0, dailyTarget - todayPages)} pages to your daily goal. You’ve got this.`}</p></div><div className="goal-percent">{progress}<small>%</small></div></div>
          <ProgressBar value={progress} color="cream" className="goal-banner-bar" />
          <div className="goal-banner-footer"><span>DAILY TARGET</span><strong>{dailyTarget} pages</strong><span>✦ {streak} day streak</span></div>
        </div>
        <div className="weekly-card">
          <div className="weekly-card-heading"><div><span className="eyebrow">YOUR RHYTHM</span><h3>This week</h3></div>          <span className="weekly-total">{weeklyTotal} <small>pages</small></span></div>
          <div className="weekly-chart" aria-label="Pages read each day this week">
            {weeklyDays.map((day) => <div className="chart-column" key={day.label}><div className="chart-bar-wrap"><span className={`chart-bar ${day.label === new Date().toLocaleDateString('en', { weekday: 'short' }) ? 'highlight' : ''}`} style={{ height: `${Math.max(day.pages ? 8 : 0, (day.pages / weeklyMax) * 100)}%` }} title={`${day.pages} pages`} /></div><small>{day.label}</small></div>)}
          </div>
        </div>
      </section>

      <section className="dashboard-reading-section">
        <div>
          <div className="section-heading"><h3>Pick up where you left off</h3><Link to="/continue">Continue reading <span>→</span></Link></div>
          {reading.length ? <div className="continue-list">{reading.slice(0, 2).map((book) => {
            const percent = Math.round((book.pagesRead / book.totalPages) * 100);
            return <Link className="continue-item" key={book.id} to={`/books/${book.id}`}><img src={book.coverUrl} alt="" /><div className="continue-copy"><span className="book-genre">{book.genre}</span><strong>{book.title}</strong><span className="book-author">{book.author}</span><ProgressBar value={percent} /><small>{book.pagesRead} of {book.totalPages} pages <b>{percent}%</b></small></div><span className="continue-arrow">↗</span></Link>;
          })}</div> : <EmptyState title="A new story awaits" description="Add a book to start your reading journey." />}
        </div>
        <div className="activity-card">
          <div className="section-heading"><h3>Recent activity</h3><Link to="/goals">See all <span>→</span></Link></div>
          <div className="activity-list">{recent.map((activity) => <div className="activity-item" key={activity.id}><span className={`activity-dot ${activity.type}`} /> <div><p><strong>{activity.detail}</strong><span>{activity.bookTitle}</span></p><time>{formatDate(activity.createdAt)}</time></div></div>)}</div>
        </div>
      </section>

      <section className="dashboard-library-preview">
        <div className="section-heading"><h3>From your bookshelf</h3><Link to="/library">Explore library <span>→</span></Link></div>
        <div className="book-grid book-grid-dashboard">{books.slice(0, 4).map((book) => <BookCard key={book.id} book={book} />)}</div>
      </section>
    </div>
  );
}
