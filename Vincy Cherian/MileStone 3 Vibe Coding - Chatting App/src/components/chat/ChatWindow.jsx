import { useSelector } from 'react-redux';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';

const ChatWindow = ({ chatId }) => {
  const chat = useSelector((state) => state.chat.conversations.find((item) => item.id === chatId));

  if (!chat) {
    return <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">Select a conversation to begin.</div>;
  }

  return (
    <div className="chat-window d-flex flex-column h-100 bg-white">
      <ChatHeader chat={chat} />
      <div className="flex-grow-1 overflow-auto">
        <MessageList conversationId={chatId} />
      </div>
      <MessageComposer chatId={chatId} />
    </div>
  );
};

export default ChatWindow;
