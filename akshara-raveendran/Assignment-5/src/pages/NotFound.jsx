import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page-shell not-found">
      <span className="eyebrow">404 · WRONG TURN</span>
      <h1>That page isn't on the menu.</h1>
      <p>Let's get you back to something delicious.</p>
      <Link to="/" className="button button-primary">Back home</Link>
    </main>
  );
}
