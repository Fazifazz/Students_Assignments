import { createContext } from 'react';

/** Auth context store — kept separate so the provider file only exports components. */
export const AuthContext = createContext(null);
