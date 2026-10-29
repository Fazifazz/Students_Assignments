import { createSlice } from '@reduxjs/toolkit';

const initialConversations = [
  {
    id: 'chat-1',
    type: 'private',
    participantIds: ['u1', 'u2'],
    name: 'Maya Das',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    favorite: true,
    unreadCount: 2,
    lastMessageAt: '2026-10-26T09:20:00.000Z',
  },
  {
    id: 'chat-2',
    type: 'private',
    participantIds: ['u1', 'u3'],
    name: 'Arjun Menon',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    favorite: false,
    unreadCount: 0,
    lastMessageAt: '2026-10-26T08:15:00.000Z',
  },
  {
    id: 'group-1',
    type: 'group',
    participantIds: ['u1', 'u2', 'u3', 'u4'],
    name: 'Launch Crew',
    avatar:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80',
    favorite: false,
    unreadCount: 5,
    lastMessageAt: '2026-10-26T07:50:00.000Z',
  },
];

const initialState = {
  conversations: initialConversations,
  selectedChatId: 'chat-1',
  search: '',
  filter: 'all',
  favorites: ['chat-1'],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setConversationSearch: (state, action) => {
      state.search = action.payload;
    },
    setConversationFilter: (state, action) => {
      state.filter = action.payload;
    },
    toggleFavorite: (state, action) => {
      const chatId = action.payload;
      const isFavorite = state.favorites.includes(chatId);

      if (isFavorite) {
        state.favorites = state.favorites.filter((id) => id !== chatId);
      } else {
        state.favorites.push(chatId);
      }

      const chat = state.conversations.find((item) => item.id === chatId);
      if (chat) {
        chat.favorite = !chat.favorite;
      }
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
      state.selectedChatId = action.payload.id;
    },
    addParticipantToConversation: (state, action) => {
      const { chatId, participantId } = action.payload;
      const chat = state.conversations.find((item) => item.id === chatId);
      if (chat && !chat.participantIds.includes(participantId)) {
        chat.participantIds.push(participantId);
      }
    },
    removeParticipantFromConversation: (state, action) => {
      const { chatId, participantId } = action.payload;
      const chat = state.conversations.find((item) => item.id === chatId);
      if (chat) {
        chat.participantIds = chat.participantIds.filter((id) => id !== participantId);
      }
    },
    markConversationRead: (state, action) => {
      const chat = state.conversations.find((item) => item.id === action.payload);
      if (chat) chat.unreadCount = 0;
    },
    updateConversationPreview: (state, action) => {
      const { chatId, text, timestamp } = action.payload;
      const chat = state.conversations.find((item) => item.id === chatId);
      if (!chat) return;
      chat.lastMessageAt = timestamp;
      chat.unreadCount = Math.max(0, (chat.unreadCount || 0) + (text ? 1 : 0));
    },
    clearConversationHistory: (state, action) => {
      const chatId = action.payload;
      const chat = state.conversations.find((item) => item.id === chatId);
      if (chat) {
        chat.lastMessageAt = new Date().toISOString();
        chat.unreadCount = 0;
      }
    },
  },
});

export const {
  setSelectedChat,
  setConversationSearch,
  setConversationFilter,
  toggleFavorite,
  addConversation,
  addParticipantToConversation,
  removeParticipantFromConversation,
  markConversationRead,
  updateConversationPreview,
  clearConversationHistory,
} = chatSlice.actions;

export default chatSlice.reducer;
