import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

export const useAuthHook = () => {
  const auth = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!auth.user);
  }, [auth.user]);

  return {
    ...auth,
    isAuthenticated,
    isTrainer: auth.user?.isTrainer || false,
    userId: auth.user?.id,
  };
};