import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BookmarkEditor from '../components/BookmarkEditor';
import { addBookmark, deleteBookmark, updateBookmark } from '../features/bookmarks/bookmarksSlice';
import { EmptyState, Modal, PageIntro } from '../components/UI';

const formatDate = (date) => new Date(date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' });

export default function Bookmarks() {
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const books = useSelector((state) => state.books.items);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const sorted = [...bookmarks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <div className="page-content">
      <PageIntro eyebrow="LITTLE MOMENTS WORTH KEEPING" title="Your bookmarks" description="Favorite passages, thoughtful pauses, and the places to pick up again."><button className="button button-primary" onClick={() => setAdding(true)}><span>＋</span> Add bookmark</button></PageIntro>
      {sorted.length ? <div className="bookmark-list">{sorted.map((mark) => {
        const book = books.find((item) => item.id === mark.bookId);
        if (!book) return null;
        return <article className="bookmark-card" key={mark.id}><div className="bookmark-ribbon">⚑</div><div className="bookmark-card-main"><Link to={`/books/${book.id}`} className="book-genre">{book.title}</Link><div className="bookmark-card-content"><strong>Page {mark.page}</strong><p>{mark.note || 'A page worth remembering.'}</p></div><span className="bookmark-date">Saved {formatDate(mark.createdAt)}</span></div><div className="bookmark-actions"><button onClick={() => setEditing(mark)}>Edit</button><button onClick={() => dispatch(deleteBookmark(mark.id))}>Delete</button></div></article>;
      })}</div> : <EmptyState icon="⚑" title="Save a place in your story" description="Add a bookmark from any book detail page, or create one here."><button className="button button-primary" onClick={() => setAdding(true)}>Add a bookmark</button></EmptyState>}
      {(adding || editing) && <Modal title={editing ? 'Edit bookmark' : 'Add a bookmark'} onClose={() => { setAdding(false); setEditing(null); }}><BookmarkEditor books={books} initialBookmark={editing || undefined} onCancel={() => { setAdding(false); setEditing(null); }} onSave={(mark) => { if (editing) dispatch(updateBookmark(mark)); else dispatch(addBookmark(mark)); setAdding(false); setEditing(null); }} /></Modal>}
    </div>
  );
}
