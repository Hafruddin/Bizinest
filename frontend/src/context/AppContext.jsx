import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setTokenResolver } from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const AppContext = createContext();

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';

export const AppProvider = ({ children }) => {
  let clerkAuth = {};
  if (!BYPASS_AUTH) {
    try {
      clerkAuth = useAuth();
    } catch (e) {
      console.warn('Clerk useAuth failed, falling back to bypass mode context:', e);
    }
  }

  const isSignedIn = BYPASS_AUTH ? true : (clerkAuth.isSignedIn || false);

  const getToken = async () => {
    if (!BYPASS_AUTH && clerkAuth.getToken) {
      try {
        const token = await clerkAuth.getToken();
        if (token) return token;
      } catch (err) {
        console.warn('Error fetching Clerk token:', err);
      }
    }
    return 'mock_clerk_user_123';
  };

  // Set the token resolver for Axios interceptors
  useEffect(() => {
    setTokenResolver(getToken);
  }, [clerkAuth.getToken]);


  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [userProfile, setUserProfile] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Sync/Load Theme on boot

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync user profile with MongoDB
  useEffect(() => {
    const performSync = async () => {
      setIsSyncing(true);
      setSyncError(null);
      try {
        // Triggers the backend sync controller
        const res = await api.post('/auth/sync');
        setUserProfile(res.data.data);
      } catch (err) {
        console.error('Failed to sync user with database:', err);
        setSyncError(err.response?.data?.message || err.message);
      } finally {
        setIsSyncing(false);
      }
    };

    performSync();
  }, []);


  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateLocalProfile = (updatedUser) => {
    setUserProfile(updatedUser);
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        userProfile,
        isSyncing,
        syncError,
        updateLocalProfile,
        showToast,
        refetchProfile: async () => {
          try {
            const res = await api.get('/auth/profile');
            setUserProfile(res.data.data);
          } catch (err) {
            console.error('Error refetching profile:', err);
          }
        },
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-80 max-w-[90vw] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border text-xs text-white backdrop-blur-md animate-slide-in transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-600/90 border-emerald-500/30'
                : toast.type === 'error'
                ? 'bg-rose-600/90 border-rose-500/30'
                : toast.type === 'warning'
                ? 'bg-amber-600/90 border-amber-500/30'
                : 'bg-blue-600/90 border-blue-500/30'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="font-semibold break-words">{toast.message}</p>
            </div>

            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="opacity-70 hover:opacity-100 transition-opacity shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
