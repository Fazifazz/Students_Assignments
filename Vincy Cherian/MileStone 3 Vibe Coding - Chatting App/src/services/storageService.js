const STORAGE_KEY = 'chatnest-demo-state';

export const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    return parsed;
  } catch (error) {
    console.warn('Unable to load persisted app state:', error);
    return null;
  }
};

export const savePersistedState = (state) => {
  try {
    const safeState = {
      auth: state.auth,
      contacts: state.contacts,
      chat: state.chat,
      messages: state.messages,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeState));
  } catch (error) {
    console.warn('Unable to persist app state:', error);
  }
};
