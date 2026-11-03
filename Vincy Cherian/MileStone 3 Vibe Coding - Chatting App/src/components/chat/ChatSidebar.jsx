import { useDispatch, useSelector } from 'react-redux';
import { setConversationFilter, setConversationSearch } from '../../features/chats/chatSlice';
import ChatList from './ChatList';

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.chat.search);
  const filter = useSelector((state) => state.chat.filter);

  return (
    <aside className="chat-sidebar border-end bg-light h-100">
      <div className="p-3 border-bottom">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search chats"
            value={search}
            onChange={(event) => dispatch(setConversationSearch(event.target.value))}
          />
        </div>

        <div className="d-flex gap-2 mt-3 flex-wrap">
          {['all', 'favorites', 'unread'].map((option) => (
            <button
              key={option}
              type="button"
              className={`btn btn-sm ${filter === option ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => dispatch(setConversationFilter(option))}
            >
              {option === 'all' ? 'All' : option === 'favorites' ? 'Favorites' : 'Unread'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3">
        <ChatList />
      </div>
    </aside>
  );
};

export default ChatSidebar;
