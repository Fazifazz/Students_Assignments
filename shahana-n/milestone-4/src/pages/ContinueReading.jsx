import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProgressBar from '../components/ProgressBar';
import { EmptyState, PageIntro } from '../components/UI';

export default function ContinueReading() {
  const allBooks = useSelector((state) => state.books.items);
  const books = allBooks.filter((book) => book.status === 'Reading');
  const bookmarks = useSelector((state) => state.bookmarks.items);
  return (
    <div className="page-content">
      <PageIntro eyebrow="YOUR CURRENT CHAPTERS" title="Keep the story going" description="Your current reads are right here whenever you’re ready." />
      {books.length ? <div className="reading-list">{books.map((book) => {
        const latestBookmark = bookmarks.filter((item) => item.bookId === book.id).sort((a, b) => b.page - a.page)[0];
        const percent = Math.round((book.pagesRead / book.totalPages) * 100);
        return <article className="reading-card" key={book.id}><Link to={`/books/${book.id}`}><img src={book.coverUrl} alt={`Cover of ${book.title}`} /></Link><div className="reading-card-main"><span className="book-genre">{book.genre}</span><Link to={`/books/${book.id}`} className="book-title">{book.title}</Link><span className="book-author">{book.author}</span><div className="reading-progress-line"><ProgressBar value={percent} /><strong>{percent}%</strong></div><div className="reading-meta"><span>Currently on <b>page {book.pagesRead}</b> of {book.totalPages}</span><span>{latestBookmark ? `Last bookmark · page ${latestBookmark.page}` : 'No bookmarks yet'}</span></div></div><Link className="button button-primary reading-action" to={`/books/${book.id}`}>Continue reading <span>→</span></Link></article>;
      })}</div> : <EmptyState icon="◷" title="Nothing on your nightstand yet" description="Choose a book from your library to begin reading."><Link className="button button-primary" to="/library">Explore my library</Link></EmptyState>}
    </div>
  );
}
