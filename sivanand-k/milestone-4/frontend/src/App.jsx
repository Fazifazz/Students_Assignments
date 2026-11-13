import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import BookDetails from './pages/BookDetails';
import BookForm from './pages/BookForm';
import BookList from './pages/BookList';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<BookList />} />
        <Route path="books/new" element={<BookForm />} />
        <Route path="books/:id/edit" element={<BookForm />} />
        <Route path="books/:id" element={<BookDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
