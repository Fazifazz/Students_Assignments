import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="container py-5">
      <h1 className="section-title mb-4">Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return home</Link>
    </main>
  );
}

export default NotFoundPage;
