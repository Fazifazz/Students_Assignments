import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-heading">
      <p className="not-found-code">404</p>
      <p className="eyebrow">OFF THE TRACK</p>
      <h1 id="not-found-heading">This page isn’t in your plan.</h1>
      <p>We couldn’t find the page you were looking for. Let’s get you moving again.</p>
      <Link className="primary-button" to="/">Back to dashboard <span aria-hidden="true">↗</span></Link>
    </section>
  );
}

export default NotFoundPage;
