import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../features/chats/chatSlice';

const ChatHeader = ({ chat }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  return (
    <div className="chat-header d-flex justify-content-between align-items-center border-bottom p-3 bg-white">
      <div className="d-flex align-items-center gap-3">
        <img src={chat.avatar} alt={chat.name} className="rounded-circle" width="42" height="42" />
        <div>
          <h6 className="mb-0">{chat.name}</h6>
          <small className="text-muted">{chat.type === 'group' ? `${chat.participantIds.length} members` : chat.online ? 'Online now' : 'Offline'}</small>
        </div>
      </div>

      <div className="d-flex gap-2 align-items-center">
        <button type="button" className="btn btn-link text-warning" onClick={() => dispatch(toggleFavorite(chat.id))}>
          <i className={`bi ${chat.favorite ? 'bi-star-fill' : 'bi-star'} fs-5`}></i>
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-telephone"></i>
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-camera-video"></i>
        </button>
        {currentUser && <span className="badge bg-light text-dark">{currentUser.name}</span>}
      </div>
    </div>
  );
};

export default ChatHeader;
