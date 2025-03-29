'use client';

import { useEffect, useState } from 'react';
import ChatboxContainer from './components/ChatboxContainer';
import LoginForm from './components/LoginForm';
import { useAuth } from './providers/UserContext';

export default function Home() {
  const { user, loading, isLogout, setIsLogout } = useAuth();
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);

  useEffect(() => {
    if (isLogout) {
      setShowLogoutMsg(true);
      const timer = setTimeout(() => {
        setShowLogoutMsg(false);
        setIsLogout(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLogout, setIsLogout]);

  return (
    <div>
      {showLogoutMsg && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow transition-opacity duration-500">
          You have been logged out because your session expired.
        </div>
      )}
      {loading ? null : !!user?.token ? <ChatboxContainer /> : <LoginForm />}
    </div>
  );
}
