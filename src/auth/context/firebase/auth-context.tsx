'use client';

import { createContext } from 'react';

import { FirebaseContextType } from '../../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as FirebaseContextType);
