import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedChat } from '../../features/chats/chatSlice';

const ChatListItem = ({ chat, active }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const lastMessage = chat.lastMessage || 'No messages yet';

  const handleOpen = () => {
    dispatch(setSelectedChat(chat.id));
    navigate(`/chats/${chat.id}`);
  };

  return (
    <button
      type="button"
      className={`list-group-item list-group-item-action border-0 rounded-3 mb-2 ${active ? 'active-chat' : ''}`}
      onClick={handleOpen}
    >
      <div className="d-flex align-items-center gap-3">
        <div className="position-relative">
          <img src={chat.avatar} alt={chat.name} className="rounded-circle" width="48" height="48" />
          {chat.online && <span className="presence-dot"></span>}
        </div>
        <div className="flex-grow-1 text-start overflow-hidden">
          <div className="d-flex justify-content-between gap-2">
            <strong className="small fw-semibold">{chat.name}</strong>
            <small className="text-muted">{chat.time}</small>
          </div>
          <div className="d-flex justify-content-between align-items-center gap-2">
            <span className="text-muted small text-truncate" style={{ maxWidth: '160px' }}>{lastMessage}</span>
            {chat.unreadCount > 0 && <span className="badge rounded-pill bg-success">{chat.unreadCount}</span>}
          </div>
        </div>
        {chat.favorite && <i className="bi bi-star-fill text-warning fs-6"></i>}
      </div>
    </button>
  );
};

export default ChatListItem;
