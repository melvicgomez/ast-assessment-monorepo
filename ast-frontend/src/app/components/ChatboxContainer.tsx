'use client';

import Chatbox from './Chatbox';
import { useMessage } from '../providers/ChatMessageContext';
import { MessageCard } from './common/MessageCard';
import { useAuth } from '../providers/UserContext';

export default function ChatboxContainer() {
  const { messageHistory, clearMessages } = useMessage();
  const { logout } = useAuth();

  return (
    <div>
      {messageHistory.length > 0 && (
        <div className="top-0 left-0 absolute">
          <div
            className="bg-white border border-gray-400 cursor-pointer px-4 py-2 hover:bg-gray-300"
            onClick={clearMessages}
          >
            Clear messages
          </div>
        </div>
      )}

      <div className="top-0 right-0 absolute">
        <div
          className="mb-2 bg-gray-200 border border-gray-500 cursor-pointer px-4 py-2 hover:bg-gray-700 hover:text-white"
          onClick={logout}
        >
          Logout
        </div>
      </div>
      <div className="max-w-6/12 m-auto bg-white/10 h-lvh relative flex flex-col bg-gradient-to-r from-rose-800 to-pink-900">
        <div
          id="message-content-wrapper"
          className="overflow-y-auto flex-10/12 flex gap-y-2 py-2 flex-col"
        >
          {messageHistory.map((message) => (
            <MessageCard
              key={message.id}
              message={message.response}
              type={message.type}
            />
          ))}
        </div>

        <Chatbox />
      </div>
    </div>
  );
}
