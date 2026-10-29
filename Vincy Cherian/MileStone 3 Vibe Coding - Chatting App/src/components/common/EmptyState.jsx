const EmptyState = ({ title, message, action }) => (
  <div className="empty-state text-center py-5 px-3">
    <div className="icon mb-3">
      <i className="bi bi-chat-square-text fs-1 text-muted"></i>
    </div>
    <h5>{title}</h5>
    <p className="text-muted mb-3">{message}</p>
    {action}
  </div>
);

export default EmptyState;
