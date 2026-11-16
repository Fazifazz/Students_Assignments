import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ErrorMessage, LoadingSpinner } from '../components/UI';
import Dashboard from '../pages/Dashboard';
import Library from '../pages/Library';
import BookEditor from '../pages/BookEditor';
import BookDetails from '../pages/BookDetails';
import ContinueReading from '../pages/ContinueReading';
import Wishlist from '../pages/Wishlist';
import Bookmarks from '../pages/Bookmarks';
import Favourites from '../pages/Favourites';
import Goals from '../pages/Goals';
import { fetchBooks } from '../features/books/booksSlice';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';
import { fetchBookmarks } from '../features/bookmarks/bookmarksSlice';
import { fetchGoals } from '../features/goals/goalsSlice';
import { fetchReadingActivities } from '../features/readingActivity/readingActivitySlice';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadState, setLoadState] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const dispatch = useDispatch();
  const booksError = useSelector((state) => state.books.error);
  const wishlistError = useSelector((state) => state.wishlist.error);
  const bookmarksError = useSelector((state) => state.bookmarks.error);
  const goalsError = useSelector((state) => state.goals.error);
  const activityError = useSelector((state) => state.readingActivity.error);
  const operationError = booksError || wishlistError || bookmarksError || goalsError || activityError;

  useEffect(() => {
    let active = true;
    setLoadState('loading');
    setLoadError('');

    Promise.all([
      dispatch(fetchBooks()).unwrap(),
      dispatch(fetchWishlist()).unwrap(),
      dispatch(fetchBookmarks()).unwrap(),
      dispatch(fetchGoals()).unwrap(),
      dispatch(fetchReadingActivities()).unwrap(),
    ])
      .then(() => {
        if (!active) return;
        setLoadState('ready');
      })
      .catch((error) => {
        console.error('Could not load ReadTrack data from the API.', error);
        if (active) {
          setLoadError(error.response?.data?.message || error.message || 'Could not connect to the ReadTrack API.');
          setLoadState('error');
        }
      });

    return () => { active = false; };
  }, [dispatch, retryCount]);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-shell">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="main-content">
          {operationError && <ErrorMessage message={operationError} />}
          {loadState === 'loading' ? <LoadingSpinner /> : loadState === 'error' ? <div className="api-error-state"><ErrorMessage message={`Unable to load your reading data: ${loadError}`} /><button className="button button-primary" onClick={() => setRetryCount((count) => count + 1)}>Try again</button></div> : (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/books/new" element={<BookEditor />} />
              <Route path="/books/:bookId/edit" element={<BookEditor />} />
              <Route path="/books/:bookId" element={<BookDetails />} />
              <Route path="/continue" element={<ContinueReading />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
        <footer className="app-footer"><span>Made for slower mornings & one more chapter.</span><span>© 2026 ReadTrack</span></footer>
      </div>
    </div>
  );
}
