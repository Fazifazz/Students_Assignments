import { createSlice } from '@reduxjs/toolkit';

const demoMessages = {
  'chat-1': [
    {
      id: 'm-1',
      conversationId: 'chat-1',
      senderId: 'u2',
      senderName: 'Maya Das',
      text: 'Hey! Are we still on for the product review?',
      type: 'text',
      createdAt: '2026-10-26T09:18:00.000Z',
      status: 'read',
      transcript: '',
      sourceLanguage: 'en',
      translations: {},
      transcriptionStatus: 'idle',
      translationStatus: 'idle',
    },
    {
      id: 'm-2',
      conversationId: 'chat-1',
      senderId: 'u1',
      senderName: 'You',
      text: 'Yes, I am ready. I can share the latest mockup.',
      type: 'text',
      createdAt: '2026-10-26T09:19:00.000Z',
      status: 'read',
      transcript: '',
      sourceLanguage: 'en',
      translations: {},
      transcriptionStatus: 'idle',
      translationStatus: 'idle',
    },
    {
      id: 'm-3',
      conversationId: 'chat-1',
      senderId: 'u2',
      senderName: 'Maya Das',
      text: 'Perfect. I will join in ten minutes.',
      type: 'text',
      createdAt: '2026-10-26T09:20:00.000Z',
      status: 'delivered',
      transcript: '',
      sourceLanguage: 'en',
      translations: {},
      transcriptionStatus: 'idle',
      translationStatus: 'idle',
    },
  ],
  'chat-2': [
    {
      id: 'm-4',
      conversationId: 'chat-2',
      senderId: 'u3',
      senderName: 'Arjun Menon',
      text: 'I sent the revised timeline. Please review it.',
      type: 'text',
      createdAt: '2026-10-26T08:10:00.000Z',
      status: 'read',
      transcript: '',
      sourceLanguage: 'en',
      translations: {},
      transcriptionStatus: 'idle',
      translationStatus: 'idle',
    },
  ],
  'group-1': [
    {
      id: 'm-5',
      conversationId: 'group-1',
      senderId: 'u2',
      senderName: 'Maya Das',
      text: 'Morning team, we have the launch checklist ready.',
      type: 'text',
      createdAt: '2026-10-26T07:40:00.000Z',
      status: 'read',
      transcript: '',
      sourceLanguage: 'en',
      translations: {},
      transcriptionStatus: 'idle',
      translationStatus: 'idle',
    },
    {
      id: 'm-6',
      conversationId: 'group-1',
      senderId: 'u1',
      senderName: 'You',
      text: 'I am updating the assets and the page flow now.',
      type: 'text',
      createdAt: '2026-10-26T07:45:00.000Z',
      status: 'read',
      transcript: '',
      sourceLanguage: 'en',
      translations: {},
      transcriptionStatus: 'idle',
      translationStatus: 'idle',
    },
  ],
};

const initialState = {
  byConversationId: demoMessages,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.byConversationId[conversationId]) {
        state.byConversationId[conversationId] = [];
      }
      state.byConversationId[conversationId].push(message);
    },
    deleteMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      if (!state.byConversationId[conversationId]) return;
      state.byConversationId[conversationId] = state.byConversationId[conversationId].filter(
        (message) => message.id !== messageId,
      );
    },
    clearConversationMessages: (state, action) => {
      const conversationId = action.payload;
      state.byConversationId[conversationId] = [];
    },
    updateMessageStatus: (state, action) => {
      const { conversationId, messageId, status } = action.payload;
      const list = state.byConversationId[conversationId] || [];
      const message = list.find((item) => item.id === messageId);
      if (message) {
        message.status = status;
      }
    },
    updateMessageTranslation: (state, action) => {
      const { conversationId, messageId, targetLanguage, translation, status } = action.payload;
      const list = state.byConversationId[conversationId] || [];
      const message = list.find((item) => item.id === messageId);
      if (!message) return;

      if (!message.translations) message.translations = {};
      message.translations[targetLanguage] = translation;
      message.translationStatus = status;
    },
    updateMessageTranscript: (state, action) => {
      const { conversationId, messageId, transcript, language, status } = action.payload;
      const list = state.byConversationId[conversationId] || [];
      const message = list.find((item) => item.id === messageId);
      if (!message) return;

      message.transcript = transcript;
      message.sourceLanguage = language;
      message.transcriptionStatus = status;
    },
  },
});

export const {
  addMessage,
  deleteMessage,
  clearConversationMessages,
  updateMessageStatus,
  updateMessageTranslation,
  updateMessageTranscript,
} = messageSlice.actions;

export default messageSlice.reducer;
