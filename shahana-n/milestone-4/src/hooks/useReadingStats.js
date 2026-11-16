import { useSelector } from 'react-redux';

export function useReadingStats() {
  const books = useSelector((state) => state.books.items);
  const wishlist = useSelector((state) => state.wishlist.items);
  const reading = books.filter((book) => book.status === 'Reading');
  const completed = books.filter((book) => book.status === 'Completed');
  const totalPagesRead = books.reduce((total, book) => total + book.pagesRead, 0);

  return {
    totalBooks: books.length,
    currentlyReading: reading.length,
    completedBooks: completed.length,
    wishlistCount: wishlist.length,
    totalPagesRead,
  };
}
