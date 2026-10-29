import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AppNavbar from '../components/layout/AppNavbar';
import ChatWindow from '../components/chat/ChatWindow';
import { setSelectedChat } from '../features/chats/chatSlice';

const ChatDetailsPage = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);

  useEffect(() => {
    if (chatId) {
      dispatch(setSelectedChat(chatId));
    }
  }, [chatId, dispatch]);

  if (!chatId) {
    navigate('/chats');
    return null;
  }

  return (
    <div className="app-shell d-flex flex-column min-vh-100 bg-light">
      <AppNavbar />
      <div className="flex-grow-1">
        <div className="d-flex align-items-center gap-2 p-3 border-bottom bg-white">
          <button type="button" className="btn btn-light" onClick={() => navigate('/chats')}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <span className="fw-semibold">Conversation</span>
        </div>
        <ChatWindow chatId={selectedChatId || chatId} />
      </div>
    </div>
  );
};

export default ChatDetailsPage;
