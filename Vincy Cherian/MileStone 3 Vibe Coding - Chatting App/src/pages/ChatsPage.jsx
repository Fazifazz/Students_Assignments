import AppNavbar from '../components/layout/AppNavbar';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { useSelector } from 'react-redux';

const ChatsPage = () => {
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);

  return (
    <div className="app-shell d-flex flex-column min-vh-100 bg-light">
      <AppNavbar />
      <div className="chat-layout flex-grow-1">
        <div className="row g-0 h-100">
          <div className="col-lg-4 col-md-5">
            <ChatSidebar />
          </div>
          <div className="col-lg-8 col-md-7">
            <ChatWindow chatId={selectedChatId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
