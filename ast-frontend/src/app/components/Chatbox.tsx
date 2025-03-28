'use client';

import { useCallback, useState } from 'react';
import { SendMessageResponse } from '../models/messages';
import { useMessage } from '../providers/ChatMessageContext';
import { useAuth } from '../providers/UserContext';

export default function Chatbox() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, updateUser } = useAuth();

  const [contentMessage, setContentMessage] = useState<string>('');
  const { setNewMessage } = useMessage();

  const scrollToLastChild = () => {
    // NOTE: this needs to be improve in the future
    const wrapper = document.getElementById('message-content-wrapper');
    if (wrapper && wrapper.lastElementChild) {
      (wrapper.lastElementChild as HTMLElement).scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  const onSubmit = useCallback(async () => {
    // if 429, append a system message in the chat
    // if 401, clear user localStorage
    setIsLoading(true);

    setNewMessage({
      id: new Date().getTime(),
      response: contentMessage,
      type: 'user',
    });

    setContentMessage('');
    scrollToLastChild();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            message: [
              {
                role: 'user',
                content: contentMessage,
              },
            ],
          }),
        }
      );

      if (response.status === 401) {
        if (user) {
          // we remove the token but keep the last session
          // when different user login, we clear the chat history
          user.token = '';
          updateUser(user);
        }
      }

      if (response.status === 429) {
        setNewMessage({
          id: new Date().getTime(),
          response: 'Error: Too many requests. Please try again later.',
          type: 'system',
        });
      }

      const data: SendMessageResponse = await response.json();

      if (data.success) {
        setNewMessage({
          id: new Date().getTime(),
          response: data.result.response,
          type: 'bot',
        });
      }
    } catch (error) {
      console.error('testt', error);
    } finally {
      setIsLoading(false);
      scrollToLastChild();
    }
  }, [contentMessage, setNewMessage, updateUser, user]);

  return (
    <div className="w-full bg-zinc-50/50 flex flex-row">
      {isLoading && (
        <div className="absolute mx-auto -top-8 w-full flex justify-center">
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        </div>
      )}
      <textarea
        className="bg-red-100 flex-1 px-6 py-4"
        placeholder="What's on your mind?"
        rows={2}
        value={contentMessage}
        onChange={(e) => {
          setContentMessage(e.target.value);
        }}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !contentMessage}
        className={`flex items-center justify-center gap-2 min-w-1.5 font-bold py-2 px-4 focus:outline-none focus:shadow-outline ${
          isLoading || !contentMessage
            ? 'bg-blue-300 cursor-not-allowed text-white'
            : 'bg-blue-500 cursor-pointer hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? 'Processing' : 'Submit'}
      </button>
    </div>
  );
}
