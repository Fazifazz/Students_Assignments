import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center bg-light px-3">
    <h1 className="display-4 fw-bold text-success">404</h1>
    <h3 className="mb-3">This page does not exist</h3>
    <Link to="/chats" className="btn btn-success">Go to chats</Link>
  </div>
);

export default NotFoundPage;
