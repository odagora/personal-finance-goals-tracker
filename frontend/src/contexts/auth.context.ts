import { createContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Create context with undefined initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
