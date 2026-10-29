import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';

const MessageList = ({ conversationId }) => {
  const authUser = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.messages.byConversationId[conversationId] || []);

  return (
    <div className="message-stream px-3 py-4">
      {messages.length > 0 ? (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={message.senderId === authUser?.id}
            conversationId={conversationId}
          />
        ))
      ) : (
        <div className="text-center text-muted py-5">No messages yet. Say hello to start the conversation.</div>
      )}
    </div>
  );
};

export default MessageList;
