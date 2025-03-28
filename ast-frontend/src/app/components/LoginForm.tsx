'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import ErrorLabel from './common/ErrorLabel';
import { isValidEmail } from '../helpers';
import { useAuth } from '../providers/UserContext';
import { User } from '../models/user';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('liam.garcia@x.dummyjson.com');
  const [password, setPassword] = useState<string>('liamgpass');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [emailHasError, setEmailHasError] = useState<string>('');
  const [loginHasError, setLoginHasError] = useState<string>('');

  const onUserLogin = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.status === 429) {
      setLoginHasError('Too many requests. Please try again later.');
    }
    if (response.status === 400) {
      setLoginHasError('Bad request. Please check your input.');
    }

    if (!response.ok) {
      setLoginHasError('An unexpected error occurred.');
    }

    if (response.ok) {
      const data: User = await response.json();
      login(data);
    }
    setIsLoading(false);
  }, [email, login, password]);

  return (
    <div className="h-svh flex flex-col justify-center align-middle">
      <div className="max-w-md bg-zinc-200 shadow-xl p-6 mx-3 sm:m-auto">
        <div className="flex justify-center">
          <Image
            className="bg-red-800"
            src="/msg-icon.png"
            width={50}
            height={50}
            alt="MSG Logo"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              !!emailHasError ? 'border-red-500' : ''
            }`}
            id="email"
            type="email"
            placeholder="john.doe@domain.com"
            value={email}
            onChange={(v) => {
              setEmail(v.target.value);
              setEmailHasError(
                !isValidEmail(v.target.value) && v.target.value !== undefined
                  ? 'Email format is invalid'
                  : ''
              );

              setLoginHasError('');
            }}
          />
          {!!emailHasError && <ErrorLabel message={emailHasError} />}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(v) => {
              setPassword(v.target.value);
              setLoginHasError('');
            }}
          />
        </div>
        <div className="my-1">
          {!!loginHasError && <ErrorLabel message={loginHasError} />}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={onUserLogin}
            disabled={
              !email ||
              !password ||
              !!emailHasError ||
              !!loginHasError ||
              isLoading
            }
            className={`flex items-center justify-center gap-2 w-100 font-bold py-2 px-4 focus:outline-none focus:shadow-outline ${
              !email || !password || !!emailHasError || isLoading
                ? 'bg-blue-300 cursor-not-allowed text-white'
                : 'bg-blue-500 cursor-pointer hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading && (
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
            )}
            {isLoading ? 'Processing' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
