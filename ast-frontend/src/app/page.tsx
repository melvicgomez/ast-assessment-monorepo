'use client';

import ChatboxContainer from './components/ChatboxContainer';
import LoginForm from './components/LoginForm';
import { useAuth } from './providers/UserContext';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div>
      {loading ? null : user?.token ? <ChatboxContainer /> : <LoginForm />}
    </div>
  );
}
