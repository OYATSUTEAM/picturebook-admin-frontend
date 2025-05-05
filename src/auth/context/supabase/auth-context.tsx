'use client';

import { createContext } from 'react';

import { SupabaseContextType } from '../../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as SupabaseContextType);
