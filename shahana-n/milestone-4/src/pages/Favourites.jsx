import { useSelector } from 'react-redux';
import BookCard from '../components/BookCard';
import { EmptyState, PageIntro } from '../components/UI';
import { Link } from 'react-router-dom';

export default function Favourites() {
  const books = useSelector((state) => state.books.items);
  const favourites = books.filter((book) => book.favorite);
  return <div className="page-content"><PageIntro eyebrow="THE ONES THAT STAY WITH YOU" title="Your favourites" description="The books you love, all together in one place." />{favourites.length ? <div className="book-grid">{favourites.map((book) => <BookCard key={book.id} book={book} showProgress={book.status === 'Reading'} />)}</div> : <EmptyState icon="♡" title="Your favourites shelf is waiting" description="Tap the heart on any book to keep it close."><Link className="button button-primary" to="/library">Explore my library</Link></EmptyState>}</div>;
}
