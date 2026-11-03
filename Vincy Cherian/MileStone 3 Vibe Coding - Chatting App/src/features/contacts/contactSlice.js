import { createSlice } from '@reduxjs/toolkit';

const demoContacts = [
  {
    id: 'u1',
    name: 'Aisha Nair',
    email: 'aisha@chatnest.app',
    status: 'Designing the next chat idea',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    online: true,
  },
  {
    id: 'u2',
    name: 'Maya Das',
    email: 'maya@chatnest.app',
    status: 'Available for a quick call',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    online: true,
  },
  {
    id: 'u3',
    name: 'Arjun Menon',
    email: 'arjun@chatnest.app',
    status: 'In a meeting, replies soon',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    online: false,
  },
  {
    id: 'u4',
    name: 'Leah Joseph',
    email: 'leah@chatnest.app',
    status: 'Sharing travel updates',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    online: true,
  },
  {
    id: 'u5',
    name: 'Noah Shah',
    email: 'noah@chatnest.app',
    status: 'Working on bug fixes',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    online: false,
  },
];

const initialState = {
  contacts: demoContacts,
  search: '',
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action) => {
      state.contacts.unshift(action.payload);
    },
    updateContactStatus: (state, action) => {
      const index = state.contacts.findIndex((contact) => contact.id === action.payload.id);
      if (index >= 0) {
        state.contacts[index] = { ...state.contacts[index], ...action.payload.updates };
      }
    },
    setContactSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { addContact, updateContactStatus, setContactSearch } = contactSlice.actions;
export default contactSlice.reducer;
