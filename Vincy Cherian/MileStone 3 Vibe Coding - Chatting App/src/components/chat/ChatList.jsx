import { useSelector } from 'react-redux';
import ChatListItem from './ChatListItem';

const ChatList = () => {
  const conversations = useSelector((state) => state.chat.conversations);
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);
  const filter = useSelector((state) => state.chat.filter);
  const search = useSelector((state) => state.chat.search);
  const messages = useSelector((state) => state.messages.byConversationId);

  const filteredChats = conversations.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'favorites' && chat.favorite) ||
      (filter === 'unread' && chat.unreadCount > 0);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="list-group mt-3">
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => {
          const lastMessageList = messages[chat.id] || [];
          const lastMessage = lastMessageList[lastMessageList.length - 1];

          return (
            <ChatListItem
              key={chat.id}
              chat={{
                ...chat,
                lastMessage: lastMessage ? lastMessage.text : 'No messages yet',
                time: chat.lastMessageAt
                  ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '',
              }}
              active={selectedChatId === chat.id}
            />
          );
        })
      ) : (
        <div className="text-center text-muted py-4">No conversations match your filter.</div>
      )}
    </div>
  );
};

export default ChatList;
