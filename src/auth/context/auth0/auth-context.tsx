'use client';

import { createContext } from 'react';

import { Auth0ContextType } from '../../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as Auth0ContextType);
