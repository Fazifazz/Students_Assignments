# ChatNest

ChatNest is a frontend-only chat prototype inspired by modern messaging apps. It includes mock authentication, private and group conversations, message history persistence in localStorage, file attachments, microphone recording, and demo transcription/translation states.

## Architecture

- React + Vite for the UI shell and routing
- Redux Toolkit for application state
- React Router for protected routes and chat navigation
- Bootstrap 5 for responsive layout
- Browser storage for mock state persistence

## Core Redux slices

- authSlice: current user, login/logout, and profile updates
- chatSlice: selected conversation, search, filters, and favourite status
- messageSlice: chat history, attachment and audio messages, transcripts, translations
- contactSlice: mock contact seed data and presence state

## Routes

- /login
- /register
- /chats
- /chats/:chatId
- /profile
- /settings

## Mock vs real behavior

This project is a frontend prototype and intentionally does not claim to be a production-grade secure chat platform.

- Authentication is simulated and stores only demo user data in memory and browser localStorage.
- Audio recording uses the browser MediaRecorder API when supported.
- Speech transcription and translation are browser-demo flows and do not rely on a backend or secret API keys.
- File attachments are stored as temporary object URLs in the browser and are not suitable for cross-device, persistent sharing.
- Real-time multi-user communication, persistent cross-device delivery, and secure storage would require a backend service and database.

## Setup

1. Install dependencies
   npm install

2. Start the app
   npm run dev -- --host 0.0.0.0 --port 4173

3. Open the app in a browser at
   http://localhost:4173

## Demo login

- Email: aisha@chatnest.app
- Password: demo123

## Browser support notes

- Microphone recording needs HTTPS or localhost and browser permission.
- Speech recognition is browser-dependent and may be unavailable in some browsers.
- Translation and transcription actions in this prototype are intentionally labeled as demo flows rather than live cloud services.

## Production build

npm run build

## Files of interest

- src/app/store.js
- src/features/auth/authSlice.js
- src/features/chats/chatSlice.js
- src/features/messages/messageSlice.js
- src/components/chat/ChatWindow.jsx
- src/components/chat/MessageComposer.jsx
- src/pages/ChatsPage.jsx
